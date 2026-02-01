# OneCX Icon System — End-to-End Control Flow

Last updated: 2026-02-01

This document walks through the complete control flow from icon upload through query, alias resolution, client cache population, and CSS injection.

---

## 1. UPLOAD PHASE — Operator/Admin uploads icon set

### Entry point:
- `import-iconsets.sh` (local env setup)
- HTTP: `POST /internal/icons/{refId}/upload` → `IconRestController.uploadIconSet(refId, body)`

### Code flow (onecx-theme-svc):

```
IconRestController.uploadIconSet(refId, body)
  ↓
  iconService.createIcons(body, refId)  [IconService.java lines 25-47]
    ↓
    ObjectMapper.readTree(body)  ← Parse JSON icon set
    ↓
    Extract: prefix, icons object, aliases object
    ↓
    For each icon in icons:
      Create Icon entity:
        - name = prefix + ":" + iconName  (e.g., "mdi:home")
        - type = "SVG"
        - refId = "mdi"
        - body = <SVG path content>
        - parent = null
      Add to iconListToCreate
    ↓
    For each alias in aliases:
      Create Icon entity:
        - name = prefix + ":" + alias  (e.g., "mdi:house")
        - type = "SVG"
        - refId = "mdi"
        - body = null  ← NO BODY FOR ALIASES
        - parent = prefix + ":" + parentIconName  (e.g., "mdi:home")
      Add to iconListToCreate
    ↓
    iconDAO.create(iconListToCreate)
      ↓
      INSERT INTO icon (id, name, type, ref_id, body, parent, created_at, modified_at)
      VALUES (uuid, "mdi:home", "SVG", "mdi", "<path.../>", null, now, now),
             (uuid, "mdi:house", "SVG", "mdi", null, "mdi:home", now, now),
             ...
  ↓
  Response: 201 Created
```

**Key insight**: Icons and aliases are stored as separate rows. Aliases have `BODY=NULL` and `PARENT={parent-name}`.

**DB state after upload**:

```
id       | name        | type | ref_id | body          | parent        | created_at
---------|-------------|------|--------|---------------|---------------|----------
<uuid1>  | mdi:home    | SVG  | mdi    | <path .../> | NULL          | 2026-02-01
<uuid2>  | mdi:house   | SVG  | mdi    | NULL         | mdi:home      | 2026-02-01
<uuid3>  | mdi:settings| SVG  | mdi    | <path .../> | NULL          | 2026-02-01
```

---

## 2. QUERY PHASE — Shell requests icons via BFF

### Entry point:
- Component calls `getClass('mdi:home')` or `getClassAsync('mdi:home')` in integration-interface
- Integration class publishes `IconRequested` topic with `names: ['mdi:home', 'mdi:house']`

### Code flow (Shell service listening to topic):

```
Shell service subscriber:
  ↓
  Receives IconRequested topic:
    { refId: "mdi", names: ["mdi:home", "mdi:house"] }
  ↓
  debounceTime(100)  ← Wait 100ms for more requests to batch
  ↓
  Collect unique names: ["mdi:home", "mdi:house"]
  ↓
  Check window.__onecxIconCache__ for pending entries
    ("mdi:home" = undefined, "mdi:house" = undefined)
  ↓
  POST /internal/icons/mdi
    body: { names: ["mdi:home", "mdi:house"] }
    ↓ (via BFF to theme-svc)
```

### Code flow (onecx-theme-svc server-side):

```
IconRestController.findIconsByNamesAndRefId(refId="mdi", criteria)
  ↓
  iconDAO.findIconsByNameSandRefId({"mdi:home", "mdi:house"}, "mdi")
    ↓
    SELECT * FROM icon
    WHERE name IN ('mdi:home', 'mdi:house')
    AND ref_id = 'mdi'
    ↓
    Returns: [
      Icon(name="mdi:home", body="<path.../>", parent=null),
      Icon(name="mdi:house", body=null, parent="mdi:home")  ← Still NULL!
    ]
  ↓
  icons = iconService.resolveAliases(icons)  [IconService.java lines 48-67]
    ↓
    For each icon in icons:
      if icon.parent != null:
        // This is an alias
        resolvedParent = resolveParentRecursively("mdi:home", "mdi")
          ↓
          Query: SELECT * FROM icon WHERE name='mdi:home' AND ref_id='mdi'
          ↓
          Returns: Icon(name="mdi:home", body="<path.../>", parent=null)
          ↓
          parent.parent == null, so return this Icon
        ↓
        icon.setBody(resolvedParent.getBody())  ← Copy SVG to alias!
        icon.setParent(resolvedParent.getName())
        resolvedIcons.add(icon)
      else:
        // Regular icon
        resolvedIcons.add(icon)
    ↓
    Returns resolved icons:
      [
        Icon(name="mdi:home", body="<path.../>", parent=null),
        Icon(name="mdi:house", body="<path.../>", parent="mdi:home")  ← NOW HAS BODY!
      ]
  ↓
  iconMapper.mapList(resolvedIcons)
    ↓
    Convert to IconDTO (DTO = Data Transfer Object)
  ↓
  IconListResponse res = new IconListResponse()
  res.setIcons(mappedList)
  ↓
  Response: 200 OK
    {
      "icons": [
        { "name": "mdi:home", "type": "SVG", "body": "<path.../>", "parent": null },
        { "name": "mdi:house", "type": "SVG", "body": "<path.../>", "parent": "mdi:home" }
      ]
    }
```

**Key insight**: `resolveAliases()` fetches the parent icon's `BODY` from the database and fills it into the alias response. Client never sees `BODY=NULL`.

---

## 3. CACHE POPULATION PHASE — Shell publishes IconsReceived

### Code flow (Shell service):

```
Shell service receives response from theme-svc:
  {
    "icons": [
      { "name": "mdi:home", "body": "<path.../>", "parent": null },
      { "name": "mdi:house", "body": "<path.../>", "parent": "mdi:home" }
    ]
  }
  ↓
  For each icon in response:
    cssClassName = generateCssClassName(icon.name, classType)
      // e.g., "onecx-theme-icon-background-before-mdi-home"
    ↓
    window.__onecxIconCache__.mdi[icon.name] = cssClassName
    ↓
    injectCssRule(cssClassName, icon.body, classType)
      ↓ (See CSS INJECTION below)
  ↓
  Publish IconsReceived topic:
    {
      type: "IconsReceived",
      refId: "mdi",
      icons: {
        "mdi:home": "<path.../>",
        "mdi:house": "<path.../>",
        (optionally: "mdi:missing-icon": null)  ← If not found
      }
    }
```

**Window cache state**:

```javascript
window.__onecxIconCache__ = {
  mdi: {
    "mdi:home": "onecx-theme-icon-background-before-mdi-home",  // String = ready
    "mdi:house": "onecx-theme-icon-background-before-mdi-house", // String = ready
  }
}
```

---

## 4. CSS INJECTION PHASE — Generate and inject styles

### Code flow (Shell CSS generator):

```
injectCssRule(className, body, classType):
  ↓
  if classType === "background-before":
    ↓
    cssRule = `
      .onecx-theme-icon-background-before-mdi-home::before {
        content: "";
        display: inline-block;
        width: 1em; height: 1em;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url("data:image/svg+xml;utf8,<svg...>%3Cpath%20fill='currentColor'%20d='...'%20/%3E%3C/svg%3E");
      }
    `
  ↓
  else if classType === "background":
    ↓
    cssRule = `
      .onecx-theme-icon-background-mdi-home {
        background-image: url("data:image/svg+xml;utf8,<svg...>");
      }
    `
  ↓
  else if classType === "svg":
    ↓
    cssRule = `
      .onecx-theme-icon-svg-mdi-home {
        mask: url('data:image/svg+xml;utf8,...') no-repeat center / contain;
        background-color: currentColor;
      }
    `
  ↓
  Append to <style id="onecx-theme-icon-styles">:
    ↓
    document.head.querySelector("#onecx-theme-icon-styles").textContent += cssRule
  ↓
  DOM now has:
    <style id="onecx-theme-icon-styles">
      .onecx-theme-icon-background-before-mdi-home::before { ... }
      .onecx-theme-icon-background-before-mdi-house::before { ... }
    </style>
```

---

## 5. CLIENT-SIDE RESOLUTION — Component displays icon

### Entry point:
- Component in Angular calls: `const className = await getClassAsync('mdi:home')`

### Code flow (integration-interface):

```
getClass(name="mdi:home", classType="background-before"):
  ↓
  if !window.__onecxIconCache__:
    window.__onecxIconCache__ = {}
  ↓
  if !window.__onecxIconCache__[refId]:
    window.__onecxIconCache__[refId] = {}
  ↓
  let cachedValue = window.__onecxIconCache__[refId][name]
  ↓
  if cachedValue === string:
    // Already have CSS class
    return cachedValue
  ↓
  if cachedValue === undefined:
    // Pending, but return class name anyway
    return generateClassName(name, classType)  // "onecx-theme-icon-background-before-mdi-home"
  ↓
  if cachedValue === undefined || !cachedValue:
    // Not in cache yet
    window.__onecxIconCache__[refId][name] = undefined  // Mark pending
    publishIconRequested({ refId, names: [name] })  // ← Triggers Shell query
    return generateClassName(name, classType)
```

**Timeline**:
1. Component calls `getClass('mdi:home')`
   - Cache state: `undefined` (not requested yet)
   - Returns: `"onecx-theme-icon-background-before-mdi-home"`
   - Action: Publishes `IconRequested` topic

2. UI attaches class to DOM: `<i class="onecx-theme-icon-background-before-mdi-home"></i>`

3. Shell (debounce 100ms) batches request and calls BFF

4. BFF returns SVG bodies

5. Shell injects CSS rule for `.onecx-theme-icon-background-before-mdi-home::before`

6. Browser renders CSS rule → icon appears on screen

### Async resolution:

```
getClassAsync(name="mdi:home"):
  ↓
  if cachedValue === string:
    return Promise.resolve(cachedValue)
  ↓
  if cachedValue === null:
    return Promise.resolve(null)
  ↓
  if cachedValue === undefined:
    return new Promise that:
      ↓
      subscribes to IconsReceived topic
      ↓
      waits until window.__onecxIconCache__[refId][name] !== undefined
      ↓
      resolves with the class name (or null if not found)
      ↓
      with timeout: if no update after 5 seconds, reject or resolve null
```

---

## 6. COMPLETE SEQUENCE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ICON SYSTEM FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                  UPLOAD PHASE (once, admin)
                  ═════════════════════════

  Operator
    │
    ├──── import-iconsets.sh
    │
    └──→ POST /internal/icons/mdi/upload
         (iconset-mdi.json)
         │
         ├─→ IconRestController.uploadIconSet(mdi, json)
         │
         ├─→ IconService.createIcons()
         │
         ├──→ For each icon in icons:
         │     INSERT INTO icon (name, body, parent=null)
         │
         ├──→ For each alias in aliases:
         │     INSERT INTO icon (name, body=null, parent=...)
         │
         └──→ Response: 201 Created
              ✓ Database populated


              RUNTIME PHASE (repeated per component)
              ════════════════════════════════════════

  Component
    │
    ├──→ getClass("mdi:home")
    │     Returns class name immediately: "onecx-theme-icon-background-before-mdi-home"
    │     Publishes: IconRequested { refId: "mdi", names: ["mdi:home"] }
    │     │
    │     │ (debounce 100ms in Shell)
    │     │
    │     └──→ Shell service receives IconRequested
    │           ├─→ Collects: ["mdi:home", "mdi:house", ...]
    │           ├─→ Filters pending (undefined in cache)
    │           │
    │           └──→ POST /internal/icons/mdi
    │                 { names: ["mdi:home", "mdi:house"] }
    │                 │
    │                 ├─→ IconRestController.findIconsByNamesAndRefId()
    │                 │
    │                 ├─→ Query DB:
    │                 │   SELECT * FROM icon
    │                 │   WHERE name IN (...) AND ref_id = "mdi"
    │                 │
    │                 ├─→ iconService.resolveAliases():
    │                 │   For each alias (parent=null):
    │                 │     Fetch parent from DB
    │                 │     Copy parent.body to alias.body
    │                 │
    │                 └──→ Response: 200 OK
    │                       {
    │                         icons: [
    │                           { name: "mdi:home", body: "<path.../>", parent: null },
    │                           { name: "mdi:house", body: "<path.../>", parent: "mdi:home" }
    │                         ]
    │                       }
    │
    │     Shell service processes response:
    │     ├─→ For each icon:
    │     │   ├─ Generate CSS class name
    │     │   ├─ Update cache: window.__onecxIconCache__.mdi["mdi:home"] = className
    │     │   └─ Inject CSS rule: <style>.className::before { background-image: ... }</style>
    │     │
    │     └──→ Publish: IconsReceived { refId: "mdi", icons: {...} }
    │
    │ (awaiting IconsReceived)
    │
    └──→ getClassAsync("mdi:home")
         Waits for IconsReceived
         ├─ Cache updated: className
         └─ Resolves: Promise<"onecx-theme-icon-background-before-mdi-home">
    
    Component attaches to DOM:
    <i class="onecx-theme-icon-background-before-mdi-home"></i>
    
    Browser renders:
    ✓ CSS rule for .onecx-theme-icon-background-before-mdi-home::before
    ✓ background-image: url("data:image/svg+xml;...")
    ✓ Icon displays

```

---

## 7. KEY INSIGHTS

### **Why aliases have NULL BODY in DB:**
- Avoids duplication: if an icon changes, all aliases automatically get the new SVG
- Storage efficient: ~7000 icons + aliases, no 2x storage

### **Why resolveAliases() exists:**
- Takes the flat DB result (with NULL bodies) and enriches it
- Fetches parent bodies and hydrates aliases
- Client always receives complete, usable SVG

### **Why debounce in Shell:**
- If 10 components request `mdi:home` within 100ms, only 1 network request is made
- Batching reduces N+1 network calls

### **Why cache has 3 states (string | undefined | null):**
- `string` = ready to use, CSS injected
- `undefined` = requested, pending response from Shell
- `null` = confirmed not found (don't request again)

### **Why getClass vs getClassAsync:**
- `getClass` = immediate (good for predictable SSR/hydration)
- `getClassAsync` = waits for icon to load (good for certainty that icon exists)

### **Why topic instead of direct HTTP:**
- Decouples requester (components) from fulfiller (Shell)
- Allows batching without components knowing about it
- Pub/sub is familiar (TranslationCache uses same pattern)

---

## 8. ERROR CASES

**Icon not found on server:**
- Server returns response with icon missing from `icons` array
- Shell maps missing names to `null` in cache
- Client sees `null` in cache, can display fallback or default icon

**Timeout / no response:**
- `getClassAsync` times out after 5 seconds
- Client resolves `null` or retries

**Bad alias (parent not found):**
- `resolveParentRecursively()` logs warning
- Icon excluded from response or included with unresolved parent
- Client handles gracefully (fallback)

---

## 9. SUMMARY

```
Upload Once
  ↓
  DB: icons + aliases (aliases.body = NULL, aliases.parent = icon-name)

Runtime (N times)
  ↓
  Component: getClass() → returns className immediately
  ↓
  Topic: IconRequested published
  ↓
  Shell: debounce(100ms), batch unique names
  ↓
  BFF: POST /internal/icons/{refId} → gets icons + resolved aliases
  ↓
  Cache: window.__onecxIconCache__ updated
  ↓
  CSS: inject <style> rules with data URIs
  ↓
  Topic: IconsReceived published
  ↓
  Component: getClassAsync() resolves with className
  ↓
  DOM: class attached, CSS rule applied
  ↓
  ✓ Icon displayed
```
