
import { Meta, StoryObj } from "@storybook/react"

export const README = () => {
  return <div>
    <h1>@tscircuit/routing</h1>
    <p>
      This library contains routing algorithms for PCB autorouting inside of <a href="https://github.com/tscircuit/tscircuit">tscircuit</a>. Read the <a href="https://github.com/tscircuit/routing">Github README</a> for more information.
    </p>
    <p>
      The sidebar on the left has various stories that help demonstrate or test the routing algorithms.
    </p>
    <p>
      You can also use this site for debugging why something didn't route, just paste the JSON route problem
      into the <a href="?path=/story/paste-json--primary">paste JSON</a> page.
    </p>
  </div>
}

export default {
  title: "README",
  component: README,
  tags: [],
  argTypes: {},
}