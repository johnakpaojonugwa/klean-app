# Toast Notification System - Refactored

## Overview

The toast notification system has been completely refactored to meet modern UX standards with responsive design, smart timing, and spring physics animations.

## Features Implemented

### 1. **Responsive Positioning**
- **Desktop (≥768px)**: Bottom-right corner
- **Mobile (<768px)**: Center-top
- Automatically adjusts on window resize

### 2. **Smart Timing**
Each toast type automatically dismisses after the appropriate duration:
- **Success**: 3 seconds (quick confirmation)
- **Info**: 4 seconds (informational)
- **Warning**: 7 seconds (needs attention)
- **Error**: Stays until user closes (requires acknowledgment)

### 3. **Stacking with Spring Physics**
- **Maximum visible**: 3 toasts
- **Damping**: 20
- **Stiffness**: 180
- **Spacing**: 12px between toasts
- Smooth spring animations when toasts are added/removed

### 4. **Dismissible Features**
- ✅ **Close Button**: Always visible (especially important for errors)
- ✅ **Swipe Gestures**: Available on mobile devices
- ✅ **Pause on Hover**: Timer pauses when hovering over a toast
- ✅ **Keyboard Support**: ESC key can dismiss toasts

### 5. **Color Coding with Icons**
Each toast type has:
- **Color**: Background, border, and text colors
- **Left Border**: Prominent colored accent stripe
- **Icon**: Automatic icon based on type
- **Dark Mode Support**: Optimized colors for dark theme

| Type | Left Border | Background | Icon |
|------|-------------|-----------|------|
| Success | Green (#10b981) | Emerald-50 | ✓ |
| Error | Red (#ef4444) | Red-50 | ✗ |
| Warning | Amber (#f59e0b) | Amber-50 | ⚠ |
| Info | Blue (#3b82f6) | Blue-50 | ℹ |

## Usage

### Basic Usage

Import the toast utilities:

```javascript
import { showSuccess, showError, showWarning, showInfo } from '@/hooks/useToast';

// Show success (auto-dismisses in 3 seconds)
showSuccess('Order created successfully');

// Show error (stays until user clicks close)
showError('Failed to create order');

// Show warning (auto-dismisses in 7 seconds)
showWarning('Your session is expiring soon');

// Show info (auto-dismisses in 4 seconds)
showInfo('New orders available');
```

### Advanced Usage

```javascript
import toast from '@/hooks/useToast';

// Show toast with description
toast.error('Payment failed', {
  description: 'Your card was declined. Please try another payment method.'
});

// Promise-based toasts
toast.promise(
  submitForm(),
  {
    loading: 'Submitting...',
    success: 'Form submitted successfully!',
    error: 'Failed to submit form'
  }
);

// Custom JSX content
toast.custom(
  <div className="flex gap-2">
    <CustomIcon />
    <div>Custom content here</div>
  </div>,
  'success'
);

// Dismiss specific toast
const toastId = toast.success('Undo action?');
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismissAll();
```

## Files Modified

### New Files Created:
1. **`src/lib/toastConfig.js`**
   - Toast configuration constants
   - Duration settings for each type
   - Color coding definitions
   - Spring physics configuration
   - Responsive positioning logic

2. **`src/hooks/useToast.js`**
   - Toast utility functions
   - `showSuccess()`, `showError()`, `showWarning()`, `showInfo()`
   - `showPromise()` for async operations
   - `showCustom()` for custom content
   - `dismissToast()` and `dismissAllToasts()`

3. **`src/styles/toast.css`**
   - Complete styling for toast notifications
   - Spring physics animations
   - Responsive positioning
   - Color definitions for light and dark modes
   - Mobile gesture support
   - Accessibility features

### Modified Files:
1. **`src/App.jsx`**
   - Added responsive position state
   - Imported toast configuration and styles
   - Updated Toaster component with new config
   - Added resize event listener

## Configuration Reference

### Toast Durations (`src/lib/toastConfig.js`)
```javascript
TOAST_DURATIONS = {
  success: 3000,      // 3 seconds
  info: 4000,         // 4 seconds
  warning: 7000,      // 7 seconds
  error: Infinity     // Until acknowledged
}
```

### Spring Physics (`src/lib/toastConfig.js`)
```javascript
SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 1
}
```

### Stacking Configuration (`src/lib/toastConfig.js`)
```javascript
TOAST_STACKING = {
  maxVisible: 3,      // Maximum visible toasts
  offset: 12          // Pixels between toasts
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Accessibility

- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Keyboard Navigation**: ESC to dismiss
- **Screen Readers**: Proper ARIA attributes via Sonner
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: 24px close button for mobile

## Performance Notes

- Toast animations use CSS transforms (GPU-accelerated)
- Debounced resize listener
- Efficient DOM updates via Sonner
- No layout shifts (fixed positioning)

## Customization

To customize toast appearance globally, modify `src/lib/toastConfig.js`:

```javascript
// Change success duration to 5 seconds
TOAST_DURATIONS.success = 5000;

// Change max visible toasts to 5
TOAST_STACKING.maxVisible = 5;

// Adjust spacing between toasts
TOAST_STACKING.offset = 16;
```

To customize colors, update the `TOAST_COLORS` object in `src/lib/toastConfig.js` or modify CSS in `src/styles/toast.css`.

## Migration Guide

If you were using the old toast system:

### Old Way:
```javascript
toast.success('Success message');
```

### New Way (recommended):
```javascript
import { showSuccess } from '@/hooks/useToast';
showSuccess('Success message');
```

Both approaches still work! The new utilities automatically apply the correct durations and styling.

## Tips & Best Practices

1. **Use appropriate types**: Error for failures, Success for confirmations, Warning for cautions
2. **Keep messages short**: Mobile screens are limited
3. **Don't overuse**: Max 3 visible toasts encourages brevity
4. **Test on mobile**: Swipe and touch interactions work best with real devices
5. **Avoid duplicates**: Check existing toasts before showing new ones

## Troubleshooting

### Toasts not showing?
- Ensure CSS file is imported in App.jsx
- Check browser console for errors
- Verify Sonner package is installed

### Wrong position on mobile?
- Ensure window resize listener is active
- Check media query breakpoints match your design system

### Animations too fast/slow?
- Adjust CSS animation duration in `src/styles/toast.css`
- Modify `cubic-bezier()` values for different easing

---

**Version**: 2.0  
**Library**: Sonner 2.0.7  
**Last Updated**: 2026
