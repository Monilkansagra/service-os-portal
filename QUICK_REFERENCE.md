# Quick Reference Guide - CSS Classes & Utilities

## 🎨 Color Classes

### Primary Colors

```tsx
// Text colors
text - indigo - 600; // Main text color
text - indigo - 700; // Darker text
text - slate - 900; // Black text (default)
text - slate - 500; // Gray text

// Background colors
bg - indigo - 600; // Primary background
bg - indigo - 50; // Light background
bg - white; // White background
bg - indigo - 100; // Accent background

// Border colors
border - indigo - 200; // Light borders
border - indigo - 100; // Lighter borders
```

### Semantic Colors

```tsx
// Success
bg-emerald-100 text-emerald-700    // Green badge
border-emerald-200

// Warning
bg-amber-100 text-amber-700        // Yellow badge
border-amber-200

// Danger
bg-red-100 text-red-700            // Red badge
border-red-200
```

## ✨ Animation Classes

### Page Entry

```tsx
// Use on main container
<div className="animate-in">

// Slide variations
<div className="animate-in-left">    // From left
<div className="animate-in-right">   // From right
<div className="animate-in">         // From bottom
```

### Fade Animations

```tsx
<div className="animate-fade-in">
<div className="animate-scale-in">
```

### Continuous Effects

```tsx
// Active menu items, glowing cards
<div className="glow-primary">       // Indigo glow
<div className="glow-accent">        // Pink glow
<div className="floating">           // Floating effect
```

## 🎯 Hover Effects

### Cards

```tsx
<div className="card-hover">
  // Automatically lifts up with shadow on hover
</div>

<div className="bg-white p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-1">
  // Manual card hover effect
</div>
```

### Buttons

```tsx
<button className="btn-primary">Save</button>
<button className="btn-secondary">Cancel</button>
<button className="btn-danger">Delete</button>
<button className="btn-success">Confirm</button>
```

### Interactive Elements

```tsx
// Icon hover effect
<div className="group-hover:scale-110 transition-transform">

// Text hover effect
<a className="hover:text-indigo-600 transition-colors">Link</a>

// Background hover effect
<element className="hover:bg-indigo-100 transition-all">
```

## 📱 Responsive Classes

### Grid Responsive

```tsx
// 1 col mobile, 2 tablet, 3-4 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// 1 col mobile, 2 desktop
<div className="grid grid-cols-1 md:grid-cols-2">
```

### Flex Responsive

```tsx
// Stack mobile, side-by-side desktop
<div className="flex flex-col md:flex-row gap-4">
```

### Display Responsive

```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="md:hidden">Mobile only</div>
```

## 📋 Form Classes

### Input Fields

```tsx
<input className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50" />
```

### Select Dropdowns

```tsx
<select className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50" />
```

### Checkbox/Radio

```tsx
<input
  type="checkbox"
  className="w-5 h-5 rounded border-2 border-indigo-300 accent-indigo-600"
/>
```

### Labels

```tsx
<label className="block text-sm font-bold text-slate-900 mb-2">
  Field Name
</label>
```

## 🎬 Modal Classes

### Modal Container

```tsx
<div className="modal-backdrop">
  {" "}
  // Backdrop + centering
  <div className="modal-content"> // Content wrapper Form content...</div>
</div>
```

### Modal Header

```tsx
<div className="p-8 border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
  <h2 className="text-2xl font-black text-slate-900">Title</h2>
</div>
```

## 🏷️ Badge Classes

### Badge Styles

```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
```

## 🎯 Common Patterns

### Header Section

```tsx
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div>
    <h1 className="text-4xl font-black text-slate-900">Title</h1>
    <p className="text-slate-500 font-bold text-sm mt-2">Subtitle</p>
  </div>
  <button className="btn-primary">Action</button>
</div>
```

### Stat Card

```tsx
<div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-md card-hover">
  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
    <Icon size={24} />
  </div>
  <p className="text-[10px] font-black text-slate-500 uppercase">Label</p>
  <h3 className="text-3xl font-black text-slate-900">Value</h3>
</div>
```

### Table Row

```tsx
<tr className="hover:bg-indigo-50/30 transition-colors group">
  <td className="px-8 py-5">Content</td>
  <td className="px-8 py-5 text-right">
    <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg">
      <Edit size={18} />
    </button>
  </td>
</tr>
```

### Form Group

```tsx
<div>
  <label className="block text-sm font-bold text-slate-900 mb-2">
    Field Label *
  </label>
  <input className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-indigo-50" />
</div>
```

### Button Group

```tsx
<div className="flex gap-4 pt-4">
  <button className="flex-1 btn-primary">Save</button>
  <button className="flex-1 btn-secondary">Cancel</button>
</div>
```

## 🔧 Customization Tips

### Change Primary Color

Replace all `indigo` with your color:

```tsx
// From:
border-indigo-200 text-indigo-600
// To:
border-blue-200 text-blue-600
```

### Adjust Animation Speed

Modify in `globals.css`:

```css
/* Default: 0.5s, 0.3s, 2s */
animation: slideInUp 0.3s ease-out; /* Faster */
animation: slideInUp 0.8s ease-out; /* Slower */
```

### Change Border Radius

Update rounded classes:

```tsx
// From: rounded-xl (12px)
// To: rounded-3xl (24px)
rounded-3xl
```

### Adjust Shadow Effects

```tsx
// Light shadow
shadow-sm

// Normal shadow
shadow-md

// Heavy shadow
shadow-xl shadow-2xl
```

## ⚡ Performance Tips

1. **Use CSS Classes** instead of inline styles
2. **Leverage Tailwind Utilities** for consistency
3. **Use `transition-all` or specific properties**
4. **Avoid unnecessary animations** on mobile
5. **Use `will-change`** for heavy animations (if needed)

## 📚 Related Files

- `globals.css` - All animations and custom utilities
- `DESIGN_IMPROVEMENTS.md` - Full design system documentation
- `RESPONSIVE_DESIGN.md` - Mobile optimization guide

---

**Quick Tip**: Use `className` with space-separated Tailwind classes for responsive design:

```tsx
className = "text-2xl md:text-3xl lg:text-4xl";
```

Last Updated: February 2026
