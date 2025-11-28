import { Plugin } from 'vite';

interface UtilityClassesPluginOptions {
    /**
     * Output directory for generated stories
     * @default 'stories'
     */
    outputDir?: string;
    /**
     * Namespaces to search for utility style files
     */
    namespaces?: Record<string, string>;
    /**
     * Whether to generate on build start
     * @default true
     */
    generateOnStart?: boolean;
    /**
     * Whether to watch for file changes
     * @default true
     */
    watch?: boolean;
}
/**
 * Vite plugin for automatic utility classes generation from *.ui_styles.yml files
 */
declare function vitePluginUtilityClasses(options?: UtilityClassesPluginOptions): Plugin;

export { type UtilityClassesPluginOptions as U, vitePluginUtilityClasses as v };
