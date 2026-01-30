import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    {
      directory: "../src/docs/application",
      titlePrefix: "Application",
      files: "*.mdx"
    },
    {
      directory: "../src/docs/design-system",
      titlePrefix: "Design System",
      files: "*.mdx"
    },
    {
      directory: "../src/docs/design-system/visual-language",
      titlePrefix: "Design System/Visual Language",
      files: "**/*.mdx"
    },
    {
      directory: "../src/docs/documentation",
      titlePrefix: "Documentation",
      files: "*.mdx"
    },
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite"
};
export default config;