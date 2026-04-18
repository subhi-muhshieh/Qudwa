# Color Contrast Audit for WCAG AA

## Theme Colors (qudwaTheme)

### Base Colors
- **base-100**: `#f4fafd` (Page background)
- **base-200**: `#e3f1f9` (Cards, panels)
- **base-300**: `#cde5f4` (Borders)
- **base-content**: `#0a2640` (Primary text)

### Brand Colors
- **primary**: `#1268b1`
- **primary-focus**: `#0e528d`
- **primary-content**: `#ffffff`
- **secondary**: `#0ea9dd`
- **secondary-focus**: `#0b8bb8`
- **secondary-content**: `#ffffff`
- **accent**: `#d95d14`
- **accent-focus**: `#b54a0d`
- **accent-content**: `#ffffff`

### Semantic Colors
- **info**: `#0ea9dd` (same as secondary)
- **success**: `#10b981`
- **warning**: `#f59e0b`
- **error**: `#ef4444`

## Contrast Analysis

| Combination | Foreground | Background | Ratio | WCAG AA | Status |
|-------------|------------|------------|-------|---------|--------|
| Default text | #0a2640 | #f4fafd | ~12:1 | Pass | ✅ |
| Primary text | #1268b1 | #f4fafd | ~5.5:1 | Pass | ✅ |
| Secondary text | #0ea9dd | #f4fafd | ~2.8:1 | Fail | ⚠️ |
| Success text | #10b981 | #f4fafd | ~3.2:1 | Fail (large only) | ⚠️ |
| Warning text | #f59e0b | #f4fafd | ~1.8:1 | Fail | ⚠️ |
| Error text | #ef4444 | #f4fafd | ~4.0:1 | Fail | ⚠️ |
| Muted text (50%) | #0a264080 | #f4fafd | ~6:1 | Pass | ✅ |

## Issues Found

1. **text-secondary on base-100**: 2.8:1 - Too low for body text
   - Use for large text only (>18pt) or decorative
   - Or darken: `#0b8bb8` gives ~4.5:1

2. **text-success on base-100**: 3.2:1 - Marginal
   - Use for large text only or icons
   - Darken to `#059669` for 4.5:1

3. **text-warning on base-100**: 1.8:1 - Fails completely
   - Use only on dark backgrounds
   - Darken to `#d97706` for 4.5:1

4. **text-error on base-100**: 4.0:1 - Just below threshold
   - Darken to `#dc2626` for 5:1

## Recommended Fixes

### Option 1: Darken Semantic Colors for Text
```javascript
// In tailwind.config.js
"success": "#059669",   // Darker for 4.5:1
"warning": "#d97706",   // Darker for 4.5:1  
"error": "#dc2626",     // Darker for 5:1
```

### Option 2: Use Semantic Colors on Dark Backgrounds Only
Keep original colors but use with bg-warning/10 etc.

### Option 3: Create Semantic Text Variants
```javascript
"success": "#10b981",
"success-content": "#ffffff", // For buttons
"success-text": "#059669",    // For text on light bg
```
