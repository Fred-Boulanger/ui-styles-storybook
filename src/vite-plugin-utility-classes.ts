import type { Plugin } from 'vite'
import type { Indexer, IndexInput } from 'storybook/internal/types'
import { readFileSync } from 'fs'
import { join } from 'path'
import { parse as parseYaml } from 'yaml'
import { logger } from './logger.js'
import { 
  generateUtilityClassesCSS, 
  generateStory, 
  generateBaseStoryStructure,
  generateAutodocsContent,
  generateIndividualStoriesContent
} from './utilityClassesGenerator.js'

// Helper function to capitalize strings
const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

// Determine if a config entry is a utility definition
const isUtilityDefinition = (value: any): boolean => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.options === 'object' &&
    value.options !== null
  )
}

// Derive namespace from YAML file path
const deriveNamespaceFromPath = (yamlPath: string): string => {
  const parts = yamlPath.split('/')
  // Prefer parent directory name as namespace; fallback to filename without extension(s)
  if (parts.length > 1) {
    return parts[parts.length - 2]
  }
  const base = parts[parts.length - 1]
  return base.replace(/\.ui_styles\.yml$/, '')
}

// Check if a parsed ui_styles config requests disabling generation
const isConfigDisabled = (config: Record<string, any>): boolean => {
  const tps = config?.thirdPartySettings || {}
  const sdcStorybook = tps?.sdcStorybook || {}
  const utilityClassesA = tps?.utilityClasses || {}
  const utilityClassesB = sdcStorybook?.utilityClasses || {}
  const disableA = tps?.disableUtilityClasses
  const disableB = sdcStorybook?.disableUtilityClasses
  // Also support top-level flags if provided
  const topLevel = config?.utilityClasses || {}
  return (
    config?.enabled === false ||
    utilityClassesA?.enabled === false ||
    utilityClassesB?.enabled === false ||
    topLevel?.enabled === false ||
    disableA === true ||
    disableB === true ||
    config?.disableUtilityClasses === true
  )
}

// Generate story content from a ui_styles.yml file
const generateUtilityClassesStory = (filePath: string): string => {
  try {
    if (!filePath.endsWith('.ui_styles.yml')) {
      return ''
    }

    const fileContent = readFileSync(filePath, 'utf8')
    const config = parseYaml(fileContent) as Record<string, any>

    // Respect disable flags in the config
    if (isConfigDisabled(config)) {
      logger.info(`Skipping utility classes generation for disabled file: ${filePath}`)
      return ''
    }

    // Extract only utility definition entries from this file
    const utilities = Object.entries(config)
      .filter(([, value]) => isUtilityDefinition(value))

    if (utilities.length === 0) {
      logger.info(`No utility definitions found in ${filePath}`)
      return ''
    }

    const namespace = deriveNamespaceFromPath(filePath)

    // Global autodocs tags from thirdPartySettings per YAML file
    const tps = config?.thirdPartySettings || {}
    const sdcStorybook = tps?.sdcStorybook || {}
    const globalTags: string[] = Array.isArray(sdcStorybook?.tags) ? sdcStorybook.tags : []
    const hasAutodocs = globalTags.includes('autodocs')

    // Include CSS in the story content
    const cssContent = generateUtilityClassesCSS()

    let storiesContent: string

    if (hasAutodocs) {
      // Generate simple docs definition without individual stories
      const docsContent = generateAutodocsContent(utilities)
      storiesContent = generateBaseStoryStructure(
        '// Auto-generated utility classes documentation', 
        docsContent, 
        filePath, 
        namespace
      )
    } else {
      // Generate individual stories (original behavior)
      const stories = generateIndividualStoriesContent(utilities, namespace)
      storiesContent = generateBaseStoryStructure(
        '// Auto-generated utility classes stories', 
        stories, 
        filePath, 
        namespace
      )
    }

    // Include CSS in the story content (will be injected in render functions)
    // For now, return just the stories content - CSS will be handled in previewHead or in each story render
    return storiesContent
  } catch (error) {
    logger.error(`Error generating utility classes story from ${filePath}: ${error}`)
    throw error
  }
}

export interface UtilityClassesPluginOptions {
  /**
   * Namespaces to search for utility style files
   */
  namespaces?: Record<string, string>
}

/**
 * Vite plugin for automatic utility classes generation from *.ui_styles.yml files
 */
export default function vitePluginUiStyles(options: UtilityClassesPluginOptions = {}): Plugin {
  return {
    name: 'vite-plugin-ui-styles',
    
    async load(id: string) {
      if (!id.endsWith('.ui_styles.yml')) return

      try {
        logger.info(`Processing utility classes file: ${id}`)
        
        const storyContent = generateUtilityClassesStory(id)
        
        if (!storyContent) {
          logger.info(`No story content generated for ${id}`)
          return ''
        }
        
        return storyContent
      } catch (error) {
        logger.error(`Error loading utility classes file: ${id}, ${error}`)
        throw error
      }
    },
  }
}

// Indexer for UI Styles YAML files
export const uiStylesIndexer: Indexer = {
  test: /\.ui_styles\.yml$/,
  createIndex: async (fileName, { makeTitle }) => {
    try {
      const content = parseYaml(readFileSync(fileName, 'utf8')) as any
      
      if (isConfigDisabled(content)) {
        logger.info(`Utility classes file ${fileName} is disabled, skipping index`)
        return []
      }

      // Extract utilities to determine if there's content
      const utilities = Object.entries(content)
        .filter(([, value]) => isUtilityDefinition(value))

      if (utilities.length === 0) {
        return []
      }

      const namespace = deriveNamespaceFromPath(fileName)
      
      // Check if autodocs mode
      const tps = content?.thirdPartySettings || {}
      const sdcStorybook = tps?.sdcStorybook || {}
      const globalTags: string[] = Array.isArray(sdcStorybook?.tags) ? sdcStorybook.tags : []
      const hasAutodocs = globalTags.includes('autodocs')
      
      const tags = ['utility-classes']
      
      if (hasAutodocs) {
        // Return single entry for autodocs mode
        const baseTitle = makeTitle(`${namespace}/Utility Classes`)
        return [{
          type: 'story' as const,
          importPath: fileName,
          exportName: 'Docs',
          title: baseTitle,
          tags: [...tags, 'autodocs'],
        }]
      } else {
        // Return one entry per utility group for individual stories mode
        return utilities.map(([groupKey, definition]: [string, any]) => {
          if (definition.enabled === false) {
            return null
          }
          const { category, label } = definition
          const baseTitle = makeTitle(`${namespace}/Utility Classes/${category}/${label}`)
          return {
            type: 'story' as const,
            importPath: fileName,
            exportName: groupKey,
            title: baseTitle,
            tags,
          }
        }).filter(Boolean) as any[]
      }
    } catch (error) {
      logger.error(`Error creating index for utility classes file: ${fileName}, ${error}`)
      throw error
    }
  },
}