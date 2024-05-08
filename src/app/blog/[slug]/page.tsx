// big thanks to https://gaudion.dev/blog/nextjs-mdx-blog
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BlogPostTagBadge } from "~/components/blog/tag";
import { Separator } from "~/components/ui/separator";
import { getAllBlogsFiles, getBlogBySlug } from "~/lib/blog";
import { rehypeOptions } from "~/lib/rehype";
import "~/styles/highlight-js/github-dark.css";

const mdxOptions = {
  mdxOptions: rehypeOptions,
};

export async function generateStaticParams() {
  const files = getAllBlogsFiles();

  const paths = files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));

  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const blog = getBlogBySlug(params.slug);
  return {
    title: blog.title,
    description: blog.description,
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);
  return (
    <article className="dark:prose-invert prose prose-sm prose-stone md:prose-base lg:prose-lg mx-auto mb-24 w-full">
      <h1>{blog.title}</h1>
      <div className="flex items-end justify-between">
        <div className="max-w-sm">
          {blog.tags.map((tag) => (
            <BlogPostTagBadge
              key={tag}
              tag={tag}
              displayIcon={true}
              displayText={true}
              className="mr-1 translate-y-[2px]"
            />
          ))}
        </div>
        <p className="text-right text-sm italic">
          Published on {format(blog.date, "LLLL do y")}
        </p>
      </div>
      <Separator className="mt-2" />
      <MDXRemote // @ts-expect-error: no idea fam
        options={mdxOptions}
        source={blog.content}
        components={{ BlogPostTagBadge }}
      />
    </article>
  );
}
