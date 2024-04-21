import fs from "fs";
import matter from "gray-matter";
import { env } from "~/env";
import { SITE_CONFIG } from "./config";

export type BlogPostTag =
  | "Announcements"
  | "Language Learning"
  | "Artificial Intelligence"
  | "Web Development";

export type BlogPostMetadataData = {
  title: string;
  date: string;
  description: string;
  tags: BlogPostTag[];
  published: boolean;
};

export type BlogPost = {
  title: string;
  description: string;
  date: Date;
  slug: string;
  content: string;
  tags: BlogPostTag[];
  published: boolean;
};

export const getAllBlogsFiles = () => {
  const blogDir = SITE_CONFIG.blogFolder;
  return fs.readdirSync(`${process.cwd()}/${blogDir}`);
};

export const getAllBlogs = () => {
  const files = getAllBlogsFiles();
  const blogs: BlogPost[] = files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    return getBlogBySlug(slug);
  });

  if (env.NODE_ENV === "production") {
    return blogs.filter((blog) => blog.published);
  }

  return blogs.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getBlogBySlug = (slug: string) => {
  const blogDir = SITE_CONFIG.blogFolder;
  const fileContent = fs.readFileSync(
    `${process.cwd()}/${blogDir}/${slug}.mdx`,
    "utf-8",
  );
  const { data: frontMatter, content } = matter(fileContent);
  const metadata = frontMatter as BlogPostMetadataData;
  return {
    title: metadata.title,
    description: metadata.description,
    date: new Date(metadata.date),
    slug: slug,
    content: content,
    tags: metadata.tags.sort(),
    published: metadata.published,
  };
};
