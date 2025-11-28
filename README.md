# UI Styles Storybook

Generate Storybook utility classes stories from `*.ui_styles.yml` files.

## Features

- Automatically generates Storybook stories from YAML utility class definitions
- Provides Vite plugin for seamless integration
- Supports multiple namespaces
- Hot reload support for style file changes
- Supports both individual stories and autodocs mode
- No file generation - stories are created on-the-fly from YAML files

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

If you're using namespaces in your Storybook configuration, you can pass them to the plugin (optional, as files are discovered automatically via the indexer):

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
      }
    })],
  }),
}
```

The plugin will automatically search for `*.ui_styles.yml` files in:
- The current working directory
- All namespace directories you specify

### Using with Indexer

The plugin also provides an indexer for Storybook to automatically discover `.ui_styles.yml` files:

```typescript
// .storybook/main.ts
import { utilityClassesIndexer } from '@fredboulanger/ui-styles-storybook/main'
import type { StorybookConfig } from '@storybook/html-vite'

export default {
  // ... other config
  experimental_indexers: async (existingIndexers) => [
    ...(existingIndexers || []),
    utilityClassesIndexer,
  ],
}
```

## How It Works

The plugin uses Vite's `load()` hook to transform `.ui_styles.yml` files into Storybook stories on-the-fly. No files are written to disk - stories are generated dynamically when Storybook loads the YAML files.

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

The plugin generates stories dynamically from `.ui_styles.yml` files:
- Stories are created on-the-fly when Storybook loads the YAML files
- CSS styles are included inline in each story
- No files are written to disk
- Stories appear in Storybook's navigation under `{namespace}/Utility Classes`

## Options

- `namespaces`: Record of namespace names to directory paths (optional, files are discovered automatically via the indexer)

## License

MIT

