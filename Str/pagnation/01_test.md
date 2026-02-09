Perfect, this is a **clean, behavior-changing tweak**, and the ask is very reasonable 👍
Let’s do this **surgically** and in a way that matches your existing test style.

---

## What exactly changed (behavior-wise)

### `rows` setter

Old behavior:

* **Any non-empty previous rows** → `resetPage()` (even when rows grow)

New behavior:

* `resetPage()` **only when rows shrink**

```ts
if (this._rows$.getValue().length > value.length) {
  this.resetPage()
}
```

### `filters` setter

Old behavior:

* **Any existing filters** → `resetPage()`

New behavior:

* `resetPage()` **only when number of filters decreases**

```ts
if (this._filters$.getValue().length > value.length) {
  this.resetPage()
}
```

So we must prove **three things for each setter**:

1. Reset happens when length **decreases**
2. Reset does **NOT** happen when length **increases**
3. Reset does **NOT** happen when length is **equal**

---

## Where these tests belong

You already have this block (perfect place):

```ts
describe('rows setter (a11y announcement)', () => {
```

We’ll **add a new describe block**, purely for paging logic:

```ts
describe('rows / filters setters – resetPage behavior', () => {
```

No harness, no DOM — **pure class logic** (fast, stable).

---

## ✅ Tests for `rows` setter

### 1️⃣ Reset when rows SHRINK

```ts
it('should reset page when rows length decreases', () => {
  const resetSpy = jest.spyOn(component, 'resetPage')

  component.page = 3
  component.rows = [{ id: 1 }, { id: 2 }, { id: 3 }] as any
  resetSpy.mockClear()

  component.rows = [{ id: 1 }] as any

  expect(resetSpy).toHaveBeenCalledTimes(1)
  expect(component.page).toBe(0)
})
```

---

### 2️⃣ Do NOT reset when rows GROW

```ts
it('should NOT reset page when rows length increases', () => {
  const resetSpy = jest.spyOn(component, 'resetPage')

  component.page = 2
  component.rows = [{ id: 1 }] as any
  resetSpy.mockClear()

  component.rows = [{ id: 1 }, { id: 2 }] as any

  expect(resetSpy).not.toHaveBeenCalled()
  expect(component.page).toBe(2)
})
```

---

### 3️⃣ Do NOT reset when rows length is EQUAL

```ts
it('should NOT reset page when rows length stays the same', () => {
  const resetSpy = jest.spyOn(component, 'resetPage')

  component.page = 1
  component.rows = [{ id: 1 }, { id: 2 }] as any
  resetSpy.mockClear()

  component.rows = [{ id: 3 }, { id: 4 }] as any

  expect(resetSpy).not.toHaveBeenCalled()
  expect(component.page).toBe(1)
})
```

---

## ✅ Tests for `filters` setter

### 4️⃣ Reset when filters SHRINK

```ts
it('should reset page when filters length decreases', () => {
  const resetSpy = jest.spyOn(component, 'resetPage')

  component.page = 4
  component.filters = [
    { columnId: 'a', value: 1 },
    { columnId: 'b', value: 2 },
  ] as any
  resetSpy.mockClear()

  component.filters = [{ columnId: 'a', value: 1 }] as any

  expect(resetSpy).toHaveBeenCalledTimes(1)
  expect(component.page).toBe(0)
})
```

---

### 5️⃣ Do NOT reset when filters GROW

```ts
it('should NOT reset page when filters length increases', () => {
  const resetSpy = jest.spyOn(component, 'resetPage')

  component.page = 2
  component.filters = [{ columnId: 'a', value: 1 }] as any
  resetSpy.mockClear()

  component.filters = [
    { columnId: 'a', value: 1 },
    { columnId: 'b', value: 2 },
  ] as any

  expect(resetSpy).not.toHaveBeenCalled()
  expect(component.page).toBe(2)
})
```

---

### 6️⃣ Do NOT reset when filters length is EQUAL

```ts
it('should NOT reset page when filters length stays the same', () => {
  const resetSpy = jest.spyOn(component, 'resetPage')

  component.page = 1
  component.filters = [{ columnId: 'a', value: 1 }] as any
  resetSpy.mockClear()

  component.filters = [{ columnId: 'a', value: 2 }] as any

  expect(resetSpy).not.toHaveBeenCalled()
  expect(component.page).toBe(1)
})
```

---

## Why reviewers will be happy with this

* ✔ Tests **directly map** to the changed condition (`length > value.length`)
* ✔ No redundant DOM / harness noise
* ✔ Clear intent: shrink vs grow vs equal
* ✔ Guards against regression back to old behavior

---

If you want, next we can:

* 🔍 **Show exact coverage diff (before vs after)**
* 🧹 **Refactor setters to a shared helper + keep tests**
* 📝 **Write a 1-liner PR explanation reviewers love**

Just say the word.
