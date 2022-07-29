import relativeImages from "mdsvex-relative-images";
const config = {
  extensions: ['.svelte.md', '.md', '.svx'],
  remarkPlugins: [relativeImages],
}

export default config
