import { Plugin } from 'vite';
import { Indexer } from 'storybook/internal/types';

interface UtilityClassesPluginOptions {
    /**
     * Namespaces to search for utility style files
     */
    namespaces?: Record<string, string>;
}
/**
 * Vite plugin for automatic utility classes generation from *.ui_styles.yml files
 */
declare function vitePluginUtilityClasses(options?: UtilityClassesPluginOptions): Plugin;
declare const utilityClassesIndexer: Indexer;

export { type UtilityClassesPluginOptions as U, utilityClassesIndexer as u, vitePluginUtilityClasses as v };
