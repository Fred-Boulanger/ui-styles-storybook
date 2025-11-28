# UI Styles Storybook

Generate Storybook utility classes stories from `*.ui_styles.yml` files.

## Features

- Automatically generates Storybook stories from YAML utility class definitions
- Provides Vite plugin and indexer for seamless integration
- Supports multiple namespaces
- Hot reload support for style file changes
- Supports both individual stories and autodocs mode
- No file generation - stories are created on-the-fly from YAML files
- Automatic file discovery via Storybook indexer

## Installation

```bash
npm install @fredboulanger/ui-styles-storybook
```

## Usage

### Complete Setup

To use the plugin, you need to configure three things in your Storybook configuration:

1. **Add `.ui_styles.yml` files to the stories array**
2. **Add the Vite plugin**
3. **Add the indexer**

```typescript
// .storybook/main.ts
import { vitePluginUiStyles, uiStylesIndexer } from '@fredboulanger/ui-styles-storybook/main'
import type { StorybookConfig } from '@storybook/html-vite'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.component.yml',
    '../**/*.ui_styles.yml', // Add UI styles files
  ],
  // ... other config
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins || []), vitePluginUiStyles()],
  }),
  experimental_indexers: async (existingIndexers) => [
    ...(existingIndexers || []),
    uiStylesIndexer,
  ],
}

export default config
```

Or for JavaScript configuration:

```javascript
// .storybook/main.js
import { vitePluginUiStyles, uiStylesIndexer } from '@fredboulanger/ui-styles-storybook/main'

export default {
  stories: [
    '../components/**/*.component.yml',
    '../**/*.ui_styles.yml', // Add UI styles files
  ],
  // ... other config
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins || []), vitePluginUiStyles()],
  }),
  experimental_indexers: async (existingIndexers) => [
    ...(existingIndexers || []),
    uiStylesIndexer,
  ],
}
```

### Using with Namespaces

If you're using namespaces in your Storybook configuration, you can pass them to the plugin (optional, as files are discovered automatically via the indexer):

```typescript
// .storybook/main.ts
import { vitePluginUiStyles } from '@fredboulanger/ui-styles-storybook/main'
import { resolve } from 'path'

export default {
  // ... other config
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins || []), vitePluginUiStyles({
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

## How It Works

The plugin uses Vite's `load()` hook to transform `.ui_styles.yml` files into Storybook stories on-the-fly. No files are written to disk - stories are generated dynamically when Storybook loads the YAML files.

The indexer automatically discovers all `.ui_styles.yml` files and creates story entries in Storybook's navigation.

## Utility Style File Format

Create `*.ui_styles.yml` files in your project. Each utility definition **must** have the following required properties:

- `category`: Category name for grouping utilities
- `label`: Display name for the utility group
- `options`: Object mapping CSS class names to their labels

Optional properties:
- `description`: Description of the utility group
- `previewed_with`: Array of additional CSS classes to apply when previewing
- `links`: Array of related documentation links
- `enabled`: Boolean to enable/disable the utility (default: `true`)

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

# Enable autodocs mode for a single documentation page
thirdPartySettings:
  sdcStorybook:
    tags:
      - autodocs
    disableUtilityClasses: false
```

## Story Modes

### Individual Stories Mode (Default)

By default, each utility group becomes its own story, appearing in Storybook navigation as:
```
{namespace}/Utility Classes/{category}/{label}
```

For example: `sdc-addon/Utility Classes/Spacing/Margin`

### Autodocs Mode

When `autodocs` tag is present in `thirdPartySettings.sdcStorybook.tags`, all utilities from a file are combined into a single documentation page:

```yaml
thirdPartySettings:
  sdcStorybook:
    tags:
      - autodocs
```

In this mode, stories appear as:
```
{namespace}/Utility Classes
```

## Generated Output

The plugin generates stories dynamically from `.ui_styles.yml` files:
- Stories are created on-the-fly when Storybook loads the YAML files
- No files are written to disk
- Stories appear in Storybook's navigation automatically via the indexer
- Each utility group can be previewed individually or combined in autodocs mode

## Options

- `namespaces`: Record of namespace names to directory paths (optional, files are discovered automatically via the indexer)

## License

MIT

