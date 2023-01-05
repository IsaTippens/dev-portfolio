import { basename, dirname } from "path";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  isPublished: boolean;
  publishedOn: string;
  updatedOn: string;
};
const modules = import.meta.glob("/content/blog/**/*.md", {eager: true});

export const posts: Post[] = Object.entries(modules).map(([filepath, module]) => {
  const slug = basename(dirname(filepath));
  const { metadata } = module;
  const { html } = module.default.render();
  return {
    slug,
    html,
    ...metadata,
  };
});