import type { StorybookConfig } from "@storybook/nextjs"
const config: StorybookConfig = {
  stories: [
    "../src/stories/README.stories.tsx",
    "../src/stories/paste-json.stories.tsx",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
}
export default config
