# Toast Notification System - Quick Reference

## 🎯 What Changed?

Your toast notification system has been completely refactored to meet modern UX standards.

## ✨ New Features

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Position** | Bottom-right ✓ | Top-center ✓ |
| **Timing** | Success: 3s, Info: 4s, Warning: 7s | Error stays until closed |
| **Max Visible** | 3 toasts with spring animations | Automatically stacks |
| **Dismissible** | Close button, pause on hover | Swipe to dismiss |
| **Appearance** | Color-coded with icons + left border | Fully responsive |

## 📦 Files Created/Modified

### 📄 New Files
```
src/
  lib/
    └── toastConfig.js          # Configuration constants
  hooks/
    └── useToast.js             # Toast utilities & hooks
  styles/
    └── toast.css               # Complete styling + animations
docs/
  ├── TOAST_SYSTEM.md           # Full documentation
  ├── TOAST_EXAMPLES.md         # Code examples
  └── TOAST_QUICK_REFERENCE.md  # This file
```

### ✏️ Modified Files
```
src/
  └── App.jsx                   # Updated Toaster configuration
```

## 🚀 Quick Start

### Import the utilities:
```javascript
import { showSuccess, showError, showWarning, showInfo } from '@/hooks/useToast';
```

### Use in your code:
```javascript
showSuccess('Order created!');           // 3 seconds
showError('Payment failed');             // Until closed
showWarning('Expires in 5 minutes');     // 7 seconds
showInfo('New orders available');        // 4 seconds
```

## 🎨 Color & Icons

| Type | Color | Icon | Duration |
|------|-------|------|----------|
| Success | 🟢 Green | ✓ | 3s |
| Error | 🔴 Red | ✗ | ∞ |
| Warning | 🟡 Amber | ⚠ | 7s |
| Info | 🔵 Blue | ℹ | 4s |

## 🎬 Animations

- **Entry**: Spring animation with cubic-bezier easing
- **Exit**: Smooth fade out
- **Stacking**: New toasts push old ones up with physics
- **Swipe**: Mobile users can swipe to dismiss
- **Hover**: Timer pauses when hovering

## 📱 Responsive Behavior

### Desktop (≥768px)
- Position: Bottom-right corner
- Max width: 420px
- Spacing: 20px from edges

### Mobile (<768px)
- Position: Top-center
- Full width: `100% - 40px`
- Touch-friendly close button (24px)

## ⚙️ Configuration

### Durations
```javascript
Success:  3000ms   (3 seconds)
Info:     4000ms   (4 seconds)
Warning:  7000ms   (7 seconds)
Error:    Infinity (until closed)
```

### Spring Physics
```javascript
Damping:   20
Stiffness: 180
Mass:      1
```

### Stacking
```javascript
Max Visible: 3
Offset:      12px
```

## 🔧 Advanced Usage

### With description:
```javascript
import toast from '@/hooks/useToast';

toast.error('Payment Failed', {
  description: 'Your card was declined. Please try another.'
});
```

### For async operations:
```javascript
toast.promise(fetchData(), {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Failed'
});
```

### Custom content:
```javascript
toast.custom(
  <div>Custom JSX here</div>,
  'success'
);
```

### Manual dismiss:
```javascript
const id = toast.success('Message');
toast.dismiss(id);
toast.dismissAll();
```

## ♿ Accessibility

✅ Respects `prefers-reduced-motion`  
✅ Keyboard navigation (ESC to dismiss)  
✅ WCAG AA color contrast  
✅ Screen reader support  
✅ Touch-friendly (24px targets)  

## 🐛 Troubleshooting

**Toasts not showing?**
→ Check that `src/styles/toast.css` is imported in App.jsx

**Wrong position?**
→ Check media queries: desktop ≥768px, mobile <768px

**Not dismissing?**
→ Error toasts require manual close (by design)

**Performance issue?**
→ Limit to 3 visible toasts (already configured)

## 📚 Documentation

- **Full docs**: `docs/TOAST_SYSTEM.md`
- **Code examples**: `docs/TOAST_EXAMPLES.md`
- **Configuration**: `src/lib/toastConfig.js`
- **Styling**: `src/styles/toast.css`

## ✅ Testing Checklist

- [ ] Success toast shows for 3 seconds
- [ ] Error toast stays until closed
- [ ] Mobile shows centered at top
- [ ] Desktop shows bottom-right
- [ ] Max 3 visible (4th replaces oldest)
- [ ] Hovering pauses timer
- [ ] Swiping on mobile dismisses
- [ ] Close button works
- [ ] Icons display correctly
- [ ] Colors match spec
- [ ] Dark mode works
- [ ] Animations smooth
- [ ] Responsive on resize

## 📖 Migration Notes

### Old Code Still Works
```javascript
import { toast } from 'sonner';
toast.success('Message');  // ✅ Still works
```

### New Recommended Way
```javascript
import { showSuccess } from '@/hooks/useToast';
showSuccess('Message');    // ✅ Preferred (auto-duration)
```

Both work! The new approach automatically applies correct durations.

---

**Questions?** See `docs/TOAST_SYSTEM.md` or `docs/TOAST_EXAMPLES.md`
