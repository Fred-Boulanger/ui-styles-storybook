export { U as UtilityClassesPluginOptions, u as uiStylesIndexer, v as vitePluginUiStyles } from './main-BbD5WkCD.mjs';
import 'vite';
import 'storybook/internal/types';

interface UtilityClassDefinition {
    category: string;
    label: string;
    description?: string;
    links?: string[];
    options: Record<string, string>;
    previewed_with?: string[];
    enabled?: boolean;
}
interface UtilityClassesConfig {
    [key: string]: UtilityClassDefinition;
}
/**
 * Parses the utility classes YAML file and returns the configuration
 */
declare function parseUtilityClassesYaml(filePath: string): UtilityClassesConfig;
/**
 * Generate preview HTML for each option
 */
declare function generatePreviewHtml(definition: any, className: string, label: string, previewedWith?: string[]): string;
/**
 * Generates a story template for a utility class group (generic version)
 */
declare function generateStory(namespace: string, groupKey: string, definition: any): string;
/**
 * Generates the complete stories file content for utility classes (legacy function)
 */
declare function generateUtilityClassesStories(config: UtilityClassesConfig): string;
/**
 * Generate base story structure (common to both autodocs and individual stories)
 */
declare function generateBaseStoryStructure(comment: string, additionalContent: string, yamlPath: string, namespace: string): string;
/**
 * Generate autodocs content for all utilities
 */
declare function generateAutodocsContent(utilities: [string, any][]): string;
/**
 * Generate individual stories content
 */
declare function generateIndividualStoriesContent(utilities: [string, any][], namespace: string): string;
/**
 * Generates CSS styles for the utility classes demo
 */
declare function generateUtilityClassesCSS(): string;
/**
 * Main function to generate utility classes stories from YAML file
 */
declare function generateUtilityClassesFromYaml(yamlFilePath: string, outputDir: string): void;

declare const logger: {
    info: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
};

/**
 * Utility functions for ui-styles-storybook
 */
declare const capitalize: (str: string) => string;

export { type UtilityClassDefinition, type UtilityClassesConfig, capitalize, generateAutodocsContent, generateBaseStoryStructure, generateIndividualStoriesContent, generatePreviewHtml, generateStory, generateUtilityClassesCSS, generateUtilityClassesFromYaml, generateUtilityClassesStories, logger, parseUtilityClassesYaml };
