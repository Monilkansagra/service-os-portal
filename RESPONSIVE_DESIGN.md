# Responsive Design & Mobile Optimization Guide

## 📱 Device Breakpoints

### Mobile (< 640px)

- **Sidebar**: Hidden/Collapsible
- **Grid**: Single column layout
- **Font**: Slightly reduced sizes
- **Spacing**: Compact padding
- **Buttons**: Full width

### Tablet (640px - 1024px)

- **Grid**: 2-3 columns
- **Sidebar**: Visible on landscape
- **Font**: Medium sizes
- **Spacing**: Normal padding
- **Buttons**: Full width in forms

### Desktop (> 1024px)

- **Sidebar**: Always visible (fixed)
- **Grid**: 3-4 columns
- **Font**: Standard sizes
- **Spacing**: Full spacing
- **Buttons**: Inline with forms

## 🎯 Responsive Components

### Headers

```tsx
<h1 className="text-4xl md:text-3xl sm:text-2xl">Title</h1>
/* Desktop: 4xl, Tablet: 3xl, Mobile: 2xl */
```

### Grid Layouts

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-6">
/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3-4 cols */
```

### Forms

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
/* Mobile: Full width fields, Desktop: Side-by-side */
```

### Tables

```tsx
<div className="overflow-x-auto">
  <table>...</table>
</div>
/* Scrollable on mobile, normal on desktop */
```

## 📐 Spacing Guidelines

### Mobile (Compact)

```css
padding: 1rem; /* 16px */
margin: 0.5rem; /* 8px */
gap: 1rem; /* 16px */
```

### Tablet (Normal)

```css
padding: 1.5rem; /* 24px */
margin: 1rem; /* 16px */
gap: 1.5rem; /* 24px */
```

### Desktop (Spacious)

```css
padding: 2rem; /* 32px */
margin: 1.5rem; /* 24px */
gap: 2rem; /* 32px */
```

## 🎨 Responsive Typography

| Element | Mobile   | Tablet   | Desktop  |
| ------- | -------- | -------- | -------- |
| h1      | 1.5rem   | 2rem     | 2.5rem   |
| h2      | 1.25rem  | 1.5rem   | 2rem     |
| h3      | 1rem     | 1.25rem  | 1.5rem   |
| p       | 0.875rem | 1rem     | 1rem     |
| small   | 0.75rem  | 0.875rem | 0.875rem |

## 🎬 Responsive Animations

### Mobile

- **Reduced**: Animations are faster (0.3s instead of 0.5s)
- **Purpose**: Doesn't interfere with touch interactions
- **Glow**: Subtle, not distracting

### Desktop

- **Full**: All animations at normal speed
- **Smooth**: More elaborate transitions
- **Glow**: Full intensity

## 📊 Card Layouts

### Mobile

```tsx
<div className="grid grid-cols-1 gap-4">
  /* Single column, compact spacing */
</div>
```

### Tablet

```tsx
<div className="grid grid-cols-2 gap-6">/* Two columns, normal spacing */</div>
```

### Desktop

```tsx
<div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
  /* Three to four columns, generous spacing */
</div>
```

## 🔘 Button Responsiveness

### Mobile

- Full width in modals and forms
- Smaller padding (py-2 instead of py-3)
- Stacked vertically in groups

### Desktop

- Inline in forms
- Larger padding (py-3, py-4)
- Side-by-side in groups

```tsx
<div className="flex flex-col md:flex-row gap-4">
  <button className="flex-1">Save</button>
  <button className="flex-1">Cancel</button>
</div>
```

## 📋 Modal Responsiveness

### Mobile

```tsx
<div className="fixed inset-0 (...) p-4">
  <div className="w-full max-w-sm rounded-3xl">
    /* Full width with small margin */
  </div>
</div>
```

### Desktop

```tsx
<div className="fixed inset-0 (...) p-0">
  <div className="w-full max-w-lg rounded-3xl">
    /* Limited max-width for readability */
  </div>
</div>
```

## 🖼️ Image & Icon Responsiveness

### Icon Sizes

```tsx
<Icon size={20} />         /* Mobile */
<Icon className="md:size-24" size={20} /> /* Desktop */
```

### Avatar Sizes

```tsx
<div className="w-10 h-10 md:w-12 md:h-12">
  /* Mobile: 40px, Desktop: 48px */
</div>
```

## 📱 Touch-Friendly Design

### Mobile Considerations

- **Button Height**: Minimum 44px for touch targets
- **Spacing**: Adequate gaps between clickable elements
- **Hover**: Use different effects (background instead of shadow)
- **Long Press**: Support for context menus

### Implementation

```tsx
<button className="h-11 md:h-10 px-6 py-3 md:py-2 gap-2">
  /* Mobile: 44px height, Desktop: 40px */
</button>
```

## 🎯 Form Responsiveness

### Single Column (Mobile)

```tsx
<div className="space-y-4">
  <input />
  <input />
  <textarea />
</div>
```

### Two Column (Desktop)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input />
  <input />
  <textarea className="md:col-span-2" />
</div>
```

## 🚀 Responsive Performance

### Best Practices

1. **CSS Media Queries**: Use Tailwind's responsive prefixes
2. **Lazy Loading**: Images load on demand
3. **Font Loading**: System fonts for speed
4. **Animation Optimization**: Reduced motion on slower devices

### Lighthouse Optimization

- Mobile-First CSS
- Minimal layout shifts
- Optimized images
- Fast animations

## 🧪 Testing Responsive Design

### Viewport Sizes to Test

- **Mobile**: 375px (iPhone SE), 414px (iPhone 12)
- **Tablet**: 768px (iPad), 1024px (iPad Pro)
- **Desktop**: 1280px, 1920px, 2560px

### Testing Tools

- Chrome DevTools
- Firefox Responsive Design Mode
- Safari Responsive Design Mode
- Real devices for touch testing

## 📝 Common Responsive Patterns

### Header

```tsx
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  {/* Stacked on mobile, side-by-side on desktop */}
</div>
```

### Sidebar + Content

```tsx
<div className="flex gap-4">
  <aside className="hidden md:block w-64">
    {/* Hidden on mobile, visible on desktop */}
  </aside>
  <main className="flex-1">{/* Takes full width on mobile */}</main>
</div>
```

### Grid with Fallback

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Adapts based on screen size */}
</div>
```

## 🎬 Responsive in Motion

### Show/Hide Based on Screen

```tsx
<div className="md:hidden">Mobile Navigation</div>
<div className="hidden md:block desktop">Desktop Navigation</div>
```

### Responsive Text Display

```tsx
<div className="block md:hidden">Mobile Title</div>
<div className="hidden md:block">Desktop Title with More Info</div>
```

---

**Last Updated**: February 2026
**Tailwind CSS Version**: 4+
**Status**: ✅ Fully Responsive
