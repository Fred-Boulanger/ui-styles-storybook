"use client"
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/utilityClassesGenerator.ts
import { readFileSync } from "fs";
import { join } from "path";
import { parse as parseYaml } from "yaml";
function parseUtilityClassesYaml(filePath) {
  try {
    const fileContent = readFileSync(filePath, "utf8");
    return parseYaml(fileContent);
  } catch (error) {
    throw new Error(`Failed to parse utility classes YAML: ${error}`);
  }
}
function generateDemoContent(definition, className, label) {
  if (typeof definition?.preview_content === "string") {
    return definition.preview_content;
  }
  return label || "Demo";
}
function generatePreviewHtml(definition, className, label, previewedWith = []) {
  const previewClasses = previewedWith.join(" ");
  const combinedClasses = `${className} ${previewClasses}`.trim();
  const demoContent = generateDemoContent(definition, className, label);
  return `
    <div class="utility-item">
      <div class="utility-label">
        <code>${className}</code>
      </div>
      <div class="utility-preview">
        <div class="${combinedClasses}">
          ${demoContent}
        </div>
      </div>
    </div>`;
}
function generateStory(namespace, groupKey, definition) {
  const { category, label, description, options, previewed_with = [], links = [] } = definition;
  if (definition.enabled === false) {
    return "";
  }
  const storyKey = groupKey;
  const optionPreviews = Object.entries(options).map(([className, optionLabel]) => generatePreviewHtml(definition, className, optionLabel, previewed_with)).join("\n");
  const linksSection = links.length > 0 ? `
          <h4>Related Links:</h4>
          <ul>
            ${links.map((link) => `<li><a href="${link}" target="_blank" rel="noopener">${link}</a></li>`).join("")}
          </ul>` : "";
  return `
export const ${storyKey} = {
  title: '${namespace}/Utility Classes/${category}/${label}',
  parameters: {
    docs: {
      description: {
        story: \`${description || `Utility classes for ${label.toLowerCase()}`}\`
      }
    }
  },
  render: () => {
    return \`
      <div class="utility-demo">
        <h2>${label}</h2>
        ${description ? `<p>${description}</p>` : ""}
        ${linksSection}
        <div class="utility-grid">
          ${optionPreviews}
        </div>
      </div>
    \`
  },
  play: async ({ canvasElement }) => {
    Drupal.attachBehaviors(canvasElement, window.drupalSettings)
  },
}`;
}
function generateUtilityClassStory(groupKey, definition) {
  return generateStory("Utility Classes", groupKey, definition);
}
function generateUtilityClassesStories(config) {
  const stories = Object.entries(config).map(([groupKey, definition]) => generateUtilityClassStory(groupKey, definition)).filter(Boolean).join("\n\n");
  return `// Auto-generated utility classes stories
// Generated from *.ui_styles.yml files

${stories}

// Default export for the story file
export default {
  title: 'Utility Classes',
  parameters: {
    docs: {
      description: {
        story: 'Utility classes documentation generated from YAML configuration'
      }
    }
  }
}`;
}
function generateBaseStoryStructure(comment, additionalContent, yamlPath, namespace) {
  return [
    comment,
    `// Generated from ${yamlPath}`,
    "",
    "export default {",
    `  title: '${namespace}/Utility Classes',`,
    "  parameters: {",
    "    docs: {",
    "      description: {",
    `        story: 'Utility classes documentation generated from ${yamlPath}'`,
    "      }",
    "    }",
    "  }",
    "}",
    "",
    additionalContent
  ].join("\n");
}
function generateAutodocsContent(utilities) {
  const allUtilityPreviews = utilities.map(([groupKey, definition]) => {
    const { category, label, description, options, previewed_with = [], links = [] } = definition;
    if (definition.enabled === false) return "";
    const optionPreviews = Object.entries(options).map(([className, optionLabel]) => generatePreviewHtml(definition, className, optionLabel, previewed_with)).join("\n");
    const linksSection = links.length > 0 ? `
          <h4>Related Links:</h4>
          <ul>
            ${links.map((link) => `<li><a href="${link}" target="_blank" rel="noopener">${link}</a></li>`).join("")}
          </ul>` : "";
    return `
        <div class="utility-demo">
          <h2>${label}</h2>
          ${description ? `<p>${description}</p>` : ""}
          ${linksSection}
          <div class="utility-grid">
            ${optionPreviews}
          </div>
        </div>`;
  }).filter(Boolean).join("\n\n");
  return [
    "export const Docs = {",
    `  tags: ['autodocs'],`,
    "  render: () => {",
    "    return `",
    allUtilityPreviews,
    "    `",
    "  }",
    "}"
  ].join("\n");
}
function generateIndividualStoriesContent(utilities, namespace) {
  return utilities.map(([groupKey, definition]) => generateStory(namespace, groupKey, definition)).filter(Boolean).join("\n\n");
}
function generateUtilityClassesCSS() {
  return `
/* Utility Classes Demo Styles - Using Storybook-compatible classes */
.utility-demo {
  /* Use Storybook's docs container styling */
  padding: 1rem;
}

.utility-demo h2 {
  margin: 0 0 1rem 0;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding-bottom: 0.5rem;
}

.utility-demo p {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary, #6b7280);
  font-size: 0.875rem;
}

.utility-demo h4 {
  margin: 1rem 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text, #374151);
}

.utility-demo ul {
  margin: 0;
  padding-left: 1.5rem;
}

.utility-demo li {
  margin-bottom: 0.25rem;
}

.utility-demo a {
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  font-size: 0.875rem;
}

.utility-demo a:hover {
  text-decoration: underline;
}

/* Use CSS Grid with CSS custom properties for better Storybook integration */
.utility-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.utility-item {
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--color-background, #ffffff);
}

.utility-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border-subtle, #f3f4f6);
}

.utility-label code {
  background: var(--color-background-subtle, #f3f4f6);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: var(--font-family-mono, 'Monaco', 'Menlo', 'Ubuntu Mono', monospace);
  font-size: 0.75rem;
  color: var(--color-error, #dc2626);
  font-weight: 600;
}


.utility-preview {
  min-height: 2rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-background-subtle, #f9fafb);
  border-radius: 0.25rem;
}
`;
}
function generateUtilityClassesFromYaml(yamlFilePath, outputDir) {
  try {
    const config = parseUtilityClassesYaml(yamlFilePath);
    const storiesContent = generateUtilityClassesStories(config);
    const cssContent = generateUtilityClassesCSS();
    const storiesPath = join(outputDir, "utility-classes.stories.js");
    __require("fs").writeFileSync(storiesPath, storiesContent, "utf8");
    const cssPath = join(outputDir, "utility-classes.css");
    __require("fs").writeFileSync(cssPath, cssContent, "utf8");
    console.log(`\u2705 Generated utility classes stories: ${storiesPath}`);
    console.log(`\u2705 Generated utility classes CSS: ${cssPath}`);
  } catch (error) {
    console.error("\u274C Error generating utility classes stories:", error);
    throw error;
  }
}

// src/logger.ts
var logger = {
  info: (message, ...args) => {
    console.log(`\u2139\uFE0F  ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`\u26A0\uFE0F  ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`\u274C ${message}`, ...args);
  },
  debug: (message, ...args) => {
    console.debug(`\u{1F41B} ${message}`, ...args);
  }
};

// src/vite-plugin-utility-classes.ts
import { readFileSync as readFileSync2 } from "fs";
import { parse as parseYaml2 } from "yaml";
var isUtilityDefinition = (value) => {
  return value && typeof value === "object" && typeof value.options === "object" && value.options !== null;
};
var deriveNamespaceFromPath = (yamlPath) => {
  const parts = yamlPath.split("/");
  if (parts.length > 1) {
    return parts[parts.length - 2];
  }
  const base = parts[parts.length - 1];
  return base.replace(/\.ui_styles\.yml$/, "");
};
var isConfigDisabled = (config) => {
  const tps = config?.thirdPartySettings || {};
  const sdcStorybook = tps?.sdcStorybook || {};
  const utilityClassesA = tps?.utilityClasses || {};
  const utilityClassesB = sdcStorybook?.utilityClasses || {};
  const disableA = tps?.disableUtilityClasses;
  const disableB = sdcStorybook?.disableUtilityClasses;
  const topLevel = config?.utilityClasses || {};
  return config?.enabled === false || utilityClassesA?.enabled === false || utilityClassesB?.enabled === false || topLevel?.enabled === false || disableA === true || disableB === true || config?.disableUtilityClasses === true;
};
var generateUtilityClassesStory = (filePath) => {
  try {
    if (!filePath.endsWith(".ui_styles.yml")) {
      return "";
    }
    const fileContent = readFileSync2(filePath, "utf8");
    const config = parseYaml2(fileContent);
    if (isConfigDisabled(config)) {
      logger.info(`Skipping utility classes generation for disabled file: ${filePath}`);
      return "";
    }
    const utilities = Object.entries(config).filter(([, value]) => isUtilityDefinition(value));
    if (utilities.length === 0) {
      logger.info(`No utility definitions found in ${filePath}`);
      return "";
    }
    const namespace = deriveNamespaceFromPath(filePath);
    const tps = config?.thirdPartySettings || {};
    const sdcStorybook = tps?.sdcStorybook || {};
    const globalTags = Array.isArray(sdcStorybook?.tags) ? sdcStorybook.tags : [];
    const hasAutodocs = globalTags.includes("autodocs");
    const cssContent = generateUtilityClassesCSS();
    let storiesContent;
    if (hasAutodocs) {
      const docsContent = generateAutodocsContent(utilities);
      storiesContent = generateBaseStoryStructure(
        "// Auto-generated utility classes documentation",
        docsContent,
        filePath,
        namespace
      );
    } else {
      const stories = generateIndividualStoriesContent(utilities, namespace);
      storiesContent = generateBaseStoryStructure(
        "// Auto-generated utility classes stories",
        stories,
        filePath,
        namespace
      );
    }
    return storiesContent;
  } catch (error) {
    logger.error(`Error generating utility classes story from ${filePath}: ${error}`);
    throw error;
  }
};
function vitePluginUiStyles(options = {}) {
  return {
    name: "vite-plugin-ui-styles",
    async load(id) {
      if (!id.endsWith(".ui_styles.yml")) return;
      try {
        logger.info(`Processing utility classes file: ${id}`);
        const storyContent = generateUtilityClassesStory(id);
        if (!storyContent) {
          logger.info(`No story content generated for ${id}`);
          return "";
        }
        return storyContent;
      } catch (error) {
        logger.error(`Error loading utility classes file: ${id}, ${error}`);
        throw error;
      }
    }
  };
}
var uiStylesIndexer = {
  test: /\.ui_styles\.yml$/,
  createIndex: async (fileName, { makeTitle }) => {
    try {
      const content = parseYaml2(readFileSync2(fileName, "utf8"));
      if (isConfigDisabled(content)) {
        logger.info(`Utility classes file ${fileName} is disabled, skipping index`);
        return [];
      }
      const utilities = Object.entries(content).filter(([, value]) => isUtilityDefinition(value));
      if (utilities.length === 0) {
        return [];
      }
      const namespace = deriveNamespaceFromPath(fileName);
      const tps = content?.thirdPartySettings || {};
      const sdcStorybook = tps?.sdcStorybook || {};
      const globalTags = Array.isArray(sdcStorybook?.tags) ? sdcStorybook.tags : [];
      const hasAutodocs = globalTags.includes("autodocs");
      const tags = ["utility-classes"];
      if (hasAutodocs) {
        const baseTitle = makeTitle(`${namespace}/Utility Classes`);
        return [{
          type: "story",
          importPath: fileName,
          exportName: "Docs",
          title: baseTitle,
          tags: [...tags, "autodocs"]
        }];
      } else {
        return utilities.map(([groupKey, definition]) => {
          if (definition.enabled === false) {
            return null;
          }
          const { category, label } = definition;
          const baseTitle = makeTitle(`${namespace}/Utility Classes/${category}/${label}`);
          return {
            type: "story",
            importPath: fileName,
            exportName: groupKey,
            title: baseTitle,
            tags
          };
        }).filter(Boolean);
      }
    } catch (error) {
      logger.error(`Error creating index for utility classes file: ${fileName}, ${error}`);
      throw error;
    }
  }
};

export {
  parseUtilityClassesYaml,
  generatePreviewHtml,
  generateStory,
  generateUtilityClassesStories,
  generateBaseStoryStructure,
  generateAutodocsContent,
  generateIndividualStoriesContent,
  generateUtilityClassesCSS,
  generateUtilityClassesFromYaml,
  logger,
  vitePluginUiStyles,
  uiStylesIndexer
};
//# sourceMappingURL=chunk-NCI2DA4U.mjs.map