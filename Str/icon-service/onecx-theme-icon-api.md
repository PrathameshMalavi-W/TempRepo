# OneCX Theme Icon API — Reference

Last updated: 2026-01-29

This document describes the internal Icon API exposed by `onecx-theme-svc`, the client/BFF contract used by the Shell and integration layers, topic message formats used for event-driven requests, the client-side cache shape, CSS-class generation rules, and example payloads and responses.

## Overview

The icon subsystem provides two main capabilities:

- Uploading icon sets (JSON files) to populate the database (operator/admin use).
- Querying icons by a list of names (internal/BFF usage) to return SVG bodies (or not-found marker).

Additionally, the front-end integration uses a small pub/sub topic flow to request icons asynchronously (IconRequested / IconsReceived). The Shell service batches icon requests and queries the internal API to retrieve icon bodies.

## HTTP API

Base server (as used in OpenAPI): `http://onecx-theme-svc`

### 1) Upload icon set

- Path: `POST /internal/icons/{refId}/upload`
- Purpose: Upload a full icon set JSON (the Iconify-style icon-set file) and create DB entries for icons and aliases under `refId`.
- Security: Requires internal write permissions. When security is enabled the import scripts add two headers: `Authorization: Bearer <token>` and `apm-principal-token: <apm-token>` (see local env `versions/*/.env`). OpenAPI lists oauth2 scope `ocx-th:write`.
- Content-Type: `application/json` (request body is the icon set JSON)
- Request body: raw icon-set JSON (prefix, info, icons, aliases). Example icon-set excerpt:

```json
{
  "prefix": "mdi",
  "info": { "name": "Material Design Icons", "total": 7000 },
  "icons": {
    "home": { "body": "<path fill=\"currentColor\" d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/>" }
  },
  "aliases": {
    "house": { "parent": "home" }
  }
}
```

- Example curl (no auth):

```bash
curl -v -X POST \
  -H "Content-Type: application/json" \
  --data-binary @iconset-mdi.json \
  "http://onecx-theme-svc/internal/icons/mdi/upload"
```

- Responses:
  - `201 Created` — upload succeeded and icons persisted
  - `400 Bad Request` — invalid JSON or upload processing error
  - `415 Unsupported Media Type` — wrong Content-Type (send `application/json`)

- Why: This endpoint allows operators to bulk-import icon sets and attach them to a `refId` namespace. Icons will be persisted in the `ICON` table and later queried by BFF/front-end.

### 2) Find icons by names (bulk query)

- Path: `POST /internal/icons/{refId}`
- Purpose: Query multiple icons by their names within a `refId` namespace and receive their bodies (used by Shell service to fulfill front-end icon requests).
- Security: `ocx-th:read` or internal tokens as configured.
- Content-Type: `application/json`
- Request body schema (IconCriteria):

```json
{
  "names": ["mdi:home", "mdi:settings"]
}
```

- Response body (IconListResponse):

```json
{
  "icons": [
    { "name": "mdi:home", "type": "SVG", "body": "<path .../>", "parent": null },
    { "name": "mdi:settings", "type": "SVG", "body": "<path .../>", "parent": null }
  ]
}
```

- Notes: If an icon is an alias, `parent` will indicate the parent icon name. Consumers should resolve aliases (the service also offers alias resolution in Java service). If an icon is not found, it will be absent in `icons` array — the Shell should treat missing entries as `null`.

- Why: Bulk querying reduces round trips and allows the Shell to batch requests for icons pending in the client cache.

## Data Model (API / DB mapping)

API `Icon` fields and their mapping to DB columns:

- `name` (string) — Full icon identifier: `{prefix}:{iconName}`. DB: `NAME VARCHAR(255)`.
  - Example: `mdi:home`
- `type` (string) — Icon format/type, currently `SVG`. DB: `TYPE VARCHAR(50)`.
  - Example: `SVG`
- `body` (string/clob) — Icon SVG body (inner `<path .../>` or entire `<svg>` fragment depending on import). DB: `BODY CLOB`.
  - Example: `<path fill="currentColor" d="..."/>`
- `parent` (string|null) — For aliases, indicates parent icon name. DB: `PARENT VARCHAR(255)` (nullable).
  - Example: `mdi:car-tire-alert` or `null`
- `created_at` / `modified_at` — Timestamp fields: helpful for caching/monitoring.

Example DB row representation:

| ID (uuid) | NAME      | TYPE | REF_ID | BODY           | PARENT         | CREATED_AT                |
|-----------|-----------|------|--------|----------------|----------------|---------------------------|
| <uuid>    | mdi:home  | SVG  | mdi    | <path .../>    | NULL           | 2025-10-20T11:11:17.047Z  |

## Topic-based messaging (integration-interface)

The front-end integration uses a lightweight topic to request icons asynchronously. This reduces direct coupling and enables batching in the Shell.

- Topic constructor parameter #3 = `false` (non-persistent topic) — as requested.
- Topic name: `onecx-theme-icon-topic` (suggested; implementor can choose consistent naming)

Message types (TypeScript interfaces):

- `IconRequested` — published by integration class when icons are needed:

```ts
interface IconRequested {
  type: 'IconRequested';
  refId?: string;         // optional, default 'default' or 'mdi'
  names: string[];       // e.g. ['mdi:home', 'mdi:settings']
}
```

- `IconsReceived` — published by Shell after icons returned from BFF:

```ts
interface IconsReceived {
  type: 'IconsReceived';
  refId?: string;
  icons: { [name: string]: string | null }; // string = SVG body, null = not found
}
```

Why: decouples requester (integration class) and fulfiller (Shell service). The third constructor parameter false indicates in-memory or non-persistent nature appropriate for UI events.

## Client Cache

A central icon cache lives on `window` to enable multiple components to share icon state.

- Global cache key: `window.__onecxIconCache__`
- Shape:

```ts
interface IconCache {
  [refId: string]: { [name: string]: string | undefined | null };
}

// Example
window.__onecxIconCache__ = {
  mdi: {
    'mdi:home': 'onecx-theme-icon-background-home',   // CSS class available
    'mdi:delete': undefined,                         // requested but pending
    'mdi:ghost': null                                // confirmed not found
  }
}
```

Meaning of values:
- `string`: resolved CSS class name (icon available and CSS rule injected)
- `undefined`: requested and pending (not yet returned by Shell)
- `null`: confirmed not found (BFF responded no icon)

Why: avoids duplicate fetches and lets UI return immediately with a predictable class name while the actual CSS rule is injected later.

## Integration-class API (integration-interface)

Create a class factory in `integration-interface` which returns a class with the following API. Class naming: `onecx-theme-icon-<classType>-<sanitizedName>`.

Constructor:
- new IconHelper(topicName: string, refId?: string)
  - topicName: the shared topic used for requests
  - refId: optional namespace

Methods:
- `getClass(name: string, classType?: 'background'|'background-before'|'svg'): string`
  - Returns the CSS class name to use immediately. Ensures an entry exists in `window.__onecxIconCache__` and publishes `IconRequested` if needed.
- `getClassAsync(name: string, classType?: ...): Promise<string | null>`
  - Returns a `Promise` which resolves to the class name or `null` after `IconsReceived` updates cache.
- `destroy(): void` — unsubscribe/destroy topic.

Behavior details:
- `getClass`:
  1. Ensure `window.__onecxIconCache__[refId]` exists.
  2. If `cache[name]` is `string`: return class name.
  3. If `cache[name]` is `undefined` (pending): return generated class name immediately.
  4. If no `cache[name]` key exists: set `cache[name] = undefined`, publish `IconRequested` for that name, return generated class name.

- `getClassAsync`:
  1. If `cache[name]` is `string`: resolve immediately.
  2. If `cache[name]` is `null`: resolve `null` immediately.
  3. If `cache[name]` is `undefined` or missing: subscribe to `IconsReceived` and wait until the key is updated (or timeout), then resolve accordingly.

Why two methods: `getClass` allows immediate DOM use (class applied), `getClassAsync` is for flows that need to know whether the icon exists.

## CSS class naming & injection

- Class pattern: `onecx-theme-icon-<classType>-<sanitizedName>`
  - `classType` -> `svg`, `background`, or `background-before`
  - `sanitizedName` -> `refId` and `iconName` transformed: `:` and other non-alnum chars replaced with `-`, lowercase.
  - Example: `mdi:home` with `background-before` -> `onecx-theme-icon-background-before-mdi-home`

- A single `<style id="onecx-theme-icon-styles">` element is appended to `<head>`; rules are added/updated per icon.

CSS generation examples:

1) `background-before` (default) — generate a rule for element `.<class>` and its `::before` pseudo-element:

```css
.onecx-theme-icon-background-before-mdi-home::before {
  content: "";
  display: inline-block;
  width: 1em; height: 1em;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>%3Cpath%20fill='currentColor'%20d='...'%20/%3E%3C/svg%3E");
}
```

2) `background` — rule applied directly to the element:

```css
.onecx-theme-icon-background-mdi-home {
  background-image: url("data:image/svg+xml;utf8,<svg ...>%3Cpath...%3E%3C/svg%3E");
}
```

3) `svg` — using mask or inline SVG CSS approach (see Iconify `svg-css` docs):

```css
.onecx-theme-icon-svg-mdi-home {
  mask: url('data:image/svg+xml;utf8,<svg ...>')</svg>) no-repeat center / contain;
  background-color: currentColor;
}
```

Why: using data URIs avoids additional network calls and keeps icons scoped via CSS classes.

Security note: SVG content should be validated/sanitized on the server import path to avoid injection. Only allow known safe attributes (paths, fills) or escape unsafe chars when embedding in CSS data URIs.

## Shell service behavior (implementation notes)

- Subscribe to `onecx-theme-icon-topic` and listen for `IconRequested` messages.
- Maintain a `Set` of pending names per `refId`.
- On each `IconRequested` record, use RxJS `debounceTime(100)` to batch multiple quick requests.
- When debounce triggers, determine which names are still pending in `window.__onecxIconCache__` (value `undefined` or missing) and call internal API:

```
POST /internal/icons/{refId}
body: { names: [ 'mdi:home', 'mdi:settings' ] }
```

- When response arrives, transform `IconListResponse` into a map `{ [name]: body | null }` and update `window.__onecxIconCache__[refId][name]` with either generated CSS class name (and inject CSS) or `null`.
- Publish a single `IconsReceived` message with the map.

Why: centralizes network calls and prevents redundant fetches from many components.

## Example end-to-end sequence

1. Component calls `getClass('mdi:home')` -> integration-class ensures cache entry `undefined`, publishes `IconRequested` with `['mdi:home']` and returns CSS class `onecx-theme-icon-background-before-mdi-home`.
2. Shell receives `IconRequested`, debounces, sees `mdi:home` is pending, calls `POST /internal/icons/mdi` with `{ names: ['mdi:home'] }`.
3. Theme service responds with `IconListResponse` containing SVG body for `mdi:home`.
4. Shell injects CSS rule for `.onecx-theme-icon-background-before-mdi-home::before` (data URI) and updates `window.__onecxIconCache__.mdi['mdi:home'] = 'onecx-theme-icon-background-before-mdi-home'`.
5. Shell publishes `IconsReceived` with `{ 'mdi:home': '<svg .../>' }`.
6. Any `getClassAsync` promises waiting on `mdi:home` resolve to the class name string.

## Example payloads and sample responses

**Request**: find icons

```http
POST /internal/icons/mdi HTTP/1.1
Content-Type: application/json

{ "names": [ "mdi:home", "mdi:missing-icon" ] }
```

**Response** (200):

```json
{
  "icons": [
    { "name": "mdi:home", "type": "SVG", "body": "<path fill=\"currentColor\" d=\"M...\"/>", "parent": null }
  ]
}
```

`mdi:missing-icon` is absent which the Shell maps to `null`.

**Shell `IconsReceived` publish**:

```json
{
  "type": "IconsReceived",
  "refId": "mdi",
  "icons": {
    "mdi:home": "<path fill=\"currentColor\" d=\"M...\"/>",
    "mdi:missing-icon": null
  }
}
```

**Upload iconset**

Request: `POST /internal/icons/mdi/upload` with raw iconset JSON (see example above). Response `201 Created`.

## Error handling & edge cases

- Missing refId: endpoints require `refId` in path.
- Invalid JSON on upload: return `400`.
- Wrong Content-Type: return `415` (ensure clients set `Content-Type: application/json`).
- Timeout or partial responses: Shell should treat missing icons as `null` after a reasonable timeout or retry.
- Large batches: server may limit request size. Shell should respect batch size limits and retry/backoff on 429/5xx.

## Implementation checklist

- [ ] Create integration-interface class and topic subscription code.
- [ ] Create Angular integration service which uses the class and calls `getClass`/`getClassAsync`.
- [ ] Add Shell service to subscribe the topic, debounce and call BFF.
- [ ] Ensure server uploads sanitize SVG bodies and persist to DB.
- [ ] Ensure CSS injection and sanitization of data URIs.

## Use cases — what to pass and what not to pass

This section gives concrete guidance for callers (integration classes, Shell, import scripts) about valid payloads, common mistakes to avoid, and security/safety rules.

- Uploading an icon set (operator/admin):
  - What to pass: a valid Iconify-style JSON icon set file with `prefix`, `icons` and optional `aliases`. Content-Type must be `application/json` and the request goes to `POST /internal/icons/{refId}/upload`.
    - Example: upload `iconset-mdi.json` to `refId=mdi`.
  - What not to pass: partial HTML pages, pre-wrapped CSS, or raw SVG files that are not JSON. Do not pass extremely large files without checking server limits.

- Requesting icons (Shell / BFF):
  - What to pass: a JSON body with `names: string[]` to `POST /internal/icons/{refId}`. Names must be full icon identifiers (`{prefix}:{iconName}`) and should be de-duplicated by the caller.
    - Example request body: `{ "names": [ "mdi:home", "mdi:settings" ] }`
  - What not to pass: full icon-set JSON, SVG bodies, or client-side CSS class names. Do not pass names without prefix (unless your system documents a default refId mapping).

- Topic messages (integration-interface ↔ Shell):
  - `IconRequested`: pass only `refId` (optional) and `names: string[]`. Keep messages small and focused on identifiers.
    - Good: `{ type: 'IconRequested', refId: 'mdi', names: ['mdi:home'] }`
    - Bad: including SVG bodies or CSS rules in the topic payload — topics are for requests/notifications only.
  - `IconsReceived`: Shell should publish a map of `icons` where values are SVG body strings or `null` when not found.

- Client cache usage (integration code):
  - What to store: cache `string | undefined | null` values only. `string` must be the generated CSS class name; `undefined` signifies pending request; `null` signifies not found.
  - What not to store: raw DOM nodes, injected CSS elements, or resolved HTML fragments. Keep the cache as a simple registry of status/class names.

- CSS injection rules:
  - What to pass to the CSS generator: sanitized SVG path/body only (prefer inner `<path/>` or sanitized `<svg>` fragment). The CSS generator will URI-encode or base64-encode the SVG when embedding in `background-image`.
  - What not to pass: untrusted SVG that may contain script, external references, or event handlers. Sanitize on the server at upload time and escape special characters when embedding in CSS.

- Batching and debouncing:
  - What to do: debounce `IconRequested` events (100ms) and batch unique names per `refId`. The Shell should only request names whose cache value is missing (no key) or `undefined` (pending).
  - What not to do: fire individual network requests for each component render (causes N+1 and increased latency).

- Error and timeout handling:
  - What to expect: some icon names may be missing. The Shell maps missing entries to `null` and publishes `IconsReceived` accordingly.
  - What not to do: treat missing icons as permanent errors without allowing re-request after a server-side upload; provide an administrative flow to re-upload icon sets when required.

Why: Clear boundaries ensure small, predictable topic messages, efficient batching, safe SVG handling, and a simple client cache contract.

## References

- Iconify icon sets: https://github.com/iconify/icon-sets
- Iconify svg-css usage: https://iconify.design/docs/usage/svg-css/


---

File: `docs/onecx-theme-icon-api.md` in `onecx-theme-svc`.
