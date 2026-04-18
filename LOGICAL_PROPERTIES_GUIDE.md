# Logical Properties Migration Guide

## Why?
Logical properties make the CSS work for both LTR and RTL layouts automatically. Since the site is RTL (Arabic), using logical properties ensures consistency.

## Mapping

### Margins
- `ml-*` (margin-left) → `ms-*` (margin-inline-start)
- `mr-*` (margin-right) → `me-*` (margin-inline-end)
- `mx-*` (margin-x) → `mx-*` (works for both, but `me-*` + `ms-*` is clearer)

### Padding
- `pl-*` (padding-left) → `ps-*` (padding-inline-start)
- `pr-*` (padding-right) → `pe-*` (padding-inline-end)

### Positioning
- `left-*` → `start-*` (inset-inline-start)
- `right-*` → `end-*` (inset-inline-end)
- `text-left` → `text-start`
- `text-right` → `text-end`

### Border Radius
- `rounded-l-*` → `rounded-s-*` (start side)
- `rounded-r-*` → `rounded-e-*` (end side)
- `rounded-tl-*` → `rounded-ts-*`
- `rounded-tr-*` → `rounded-te-*`

### Border Width
- `border-l-*` → `border-s-*`
- `border-r-*` → `border-e-*`

## Examples

```jsx
// Before
<div className="ml-2 mr-4 text-right">

// After
<div className="ms-2 me-4 text-end">
```

## Files Requiring Updates

Based on grep search, these files have physical properties:

1. **ChatIcon.js** - `left-3`, `right-1` (badge position)
2. **ActivityPhotoManager.js** - `right-2`, `left-0`, `right-0`
3. **Footer.js** - `right-0`, `left-0`, `text-right` (should be `text-start` for RTL)
4. **NotificationBell.js** - `right-1`, `left-0`, `right-auto`
5. **PhotoLightbox.js** - `left-0`, `right-0`, `left-4`, `right-4`
6. **Navbar.js** - `left-4`, `right-4`, `left-0`, `ml-2`
7. **AttendanceManager.js** - `right-0`, `left-0`, `text-right`
8. **And many more...**

## Tailwind Config

Ensure `tailwind.config.js` has RTL support:

```javascript
module.exports = {
  // ...
  corePlugins: {
    // Enable logical properties
    textAlign: true,
  },
}
```

Note: Tailwind CSS v3+ supports logical properties out of the box.

## Migration Priority

**High:** Components that might need LTR support in future
**Low:** Components that will always be RTL (like this Arabic site)

For a strictly RTL Arabic site, logical properties are "nice to have" but not critical.
