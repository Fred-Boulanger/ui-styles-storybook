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
declare function vitePluginUiStyles(options?: UtilityClassesPluginOptions): Plugin;
declare const uiStylesIndexer: Indexer;

export { type UtilityClassesPluginOptions as U, uiStylesIndexer as u, vitePluginUiStyles as v };
