# UI Styles Storybook

Generate Storybook utility classes stories from `*.ui_styles.yml` files.

## Features

- Automatically generates Storybook stories from YAML utility class definitions
- Provides Vite plugin for seamless integration
- Supports multiple namespaces
- Hot reload support for style file changes
- Supports both individual stories and autodocs mode

## Installation

```bash
npm install @fredboulanger/ui-styles-storybook
```

## Usage

### Vite Plugin

Add the plugin to your Storybook configuration:

```typescript
// .storybook/main.ts
import { vitePluginUtilityClasses } from '@fredboulanger/ui-styles-storybook/main'

export default {
  // ... other config
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins || []), vitePluginUtilityClasses()],
  }),
}
```

Or for JavaScript configuration:

```javascript
// .storybook/main.js
import { vitePluginUtilityClasses } from '@fredboulanger/ui-styles-storybook/main'

export default {
  // ... other config
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins || []), vitePluginUtilityClasses()],
  }),
}
```

### Using with Namespaces

If you're using namespaces in your Storybook configuration, you can pass them to the plugin to search for utility style files in those directories:

```typescript
// .storybook/main.ts
import { vitePluginUtilityClasses } from '@fredboulanger/ui-styles-storybook/main'
import { resolve } from 'path'

export default {
  // ... other config
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins || []), vitePluginUtilityClasses({
      namespaces: {
        'custom-theme': resolve('../../../themes/custom/custom-theme'),
        'base-theme': resolve('../../../themes/custom/base-theme'),
      },
      outputDir: 'stories'
    })],
  }),
}
```

The plugin will automatically search for `*.ui_styles.yml` files in:
- The current working directory
- All namespace directories you specify

## Utility Style File Format

Create `*.ui_styles.yml` files in your project:

```yaml
# Example: utility-classes.ui_styles.yml
spacing_margin:
  category: "Spacing"
  label: "Margin"
  description: "Utility classes for margin spacing"
  options:
    m-0: "No margin"
    m-1: "Small margin"
    m-2: "Medium margin"
    m-3: "Large margin"
  previewed_with: []
  links:
    - "https://example.com/docs/margin"
  enabled: true
```

## Generated Output

The plugin generates:
- Story files: `utility-classes.{namespace}.stories.js` in the output directory
- CSS file: `utility-classes.css` with demo styles

## Options

- `outputDir`: Output directory for generated stories (default: `'stories'`)
- `namespaces`: Record of namespace names to directory paths
- `generateOnStart`: Whether to generate on build start (default: `true`)
- `watch`: Whether to watch for file changes (default: `true`)

## License

MIT

