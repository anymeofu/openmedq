# context/updates/logo_theme_and_asset_optimization_standards.md

## 🔍 New Information & Best Practices

When integrating brand logos across a React (web) and React Native (Expo) monorepo, developers must balance theme-based visibility, design constraints, and asset sizes:

1. **MIME/Header Consistency & Downsampling**:
   Avoid renaming image files without converting their internal formats (e.g., naming a JPEG as `logo.png`). Always perform true downsampling using high-quality filters (e.g., Python PIL with `LANCZOS` and `optimize=True`) to produce true PNGs with transparent channels. This can yield size reductions of up to **90-95%** (saving megabytes of initial load footprint).

2. **Theme-Dynamic Asset Loading vs. CSS Filters**:
   While CSS filters like `invert()` can resolve contrast issues by flipping colors in light mode, they do not guarantee color accuracy for specific brand assets. To achieve precise color fidelity, load separate theme-specific files (e.g., `/logo-light.png` for light mode and `/logo-dark.png` for dark mode) dynamically controlled by the theme state:
   ```tsx
   const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';
   <img src={logoSrc} className="object-contain" />
   ```

3. **Conforming startup overlays to solid styling (Rule 9)**:
   Ensure custom loading, splash, or overlay screens do not utilize linear gradients, conforming strictly to Design Rule 9 (solid, flat saturated fills). In React Native stylesheets, swap dynamic gradients out for brand-aligned solid colors (e.g., `#1a3a3a` brand Teal or `#fffaf0` brand Cream):
   ```typescript
   background: {
     borderRadius: 40,
     backgroundColor: '#1a3a3a', // Solid color panel, no gradient
     width: 128,
     height: 128,
   }
   ```

4. **Expo Monorepo Asset References**:
   Simplify platform asset catalogs by referencing standard image files (like `./assets/images/icon.png`) for `ios.icon` in `app.json` rather than referencing specialized local asset groups (`.icon`) which can complicate compilation in monorepo workspaces.

## 🛠️ Correct Implementation Examples

### 1. Dynamic Web Header Logo
```tsx
import { useTheme } from './components/theme-provider';

export function Header() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';

  return <img src={logoSrc} className="w-10 h-10 object-contain" alt="Logo" />;
}
```

### 2. Standard Mobile Config (`app.json`)
```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "ios": {
      "icon": "./assets/images/icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#fffaf0",
        "foregroundImage": "./assets/images/android-icon-foreground.png"
      }
    }
  }
}
```
