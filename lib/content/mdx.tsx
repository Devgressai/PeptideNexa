import "server-only";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { Callout } from "@/components/content/mdx/callout";
import { SourceChip } from "@/components/content/mdx/source-chip";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { FaqBlock } from "@/components/content/faq-block";

// Safe component allowlist exposed to authored MDX bodies.
// Adding a component here is an editorial decision, not a drive-by — every
// component in this map becomes part of the author surface and should be
// documented in the editorial guide.
const mdxComponents = {
  Callout,
  SourceChip,
  DisclaimerBanner,
  FaqBlock,
};

const remarkPlugins = [remarkGfm];
const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Link to section",
      },
    },
  ],
];

type MdxProps = {
  source: string | null | undefined;
};

/**
 * Render admin-authored MDX. Server component — compiled on the server, no
 * client-side MDX runtime. Unknown JSX components in the body are ignored.
 */
export function Mdx({ source }: MdxProps) {
  if (!source || source.trim().length === 0) return null;
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        // `development: false` gives us a slightly smaller production compiler.
        mdxOptions: {
          remarkPlugins,
          // Plugin-with-options tuples pass through next-mdx-remote to MDX.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rehypePlugins: rehypePlugins as any,
          development: process.env.NODE_ENV !== "production",
        },
        parseFrontmatter: false,
      }}
    />
  );
}
