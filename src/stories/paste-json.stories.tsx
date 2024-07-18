import type { Meta, StoryObj } from "@storybook/react"
import { PasteJson } from "./components/PasteJson"

const meta: Meta<typeof PasteJson> = {
  title: "Paste JSON",
  component: PasteJson,
  tags: [],
  argTypes: {},
}

export const Primary = PasteJson

export default meta
