import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";

export default function TermsOfServicePage() {
  const termsOfServiceFile = "docs/terms-of-service.mdx";
  const fileContent = fs.readFileSync(
    `${process.cwd()}/${termsOfServiceFile}`,
    "utf-8",
  );
  return (
    <div className="dark:prose-invert prose prose-sm prose-stone md:prose-base lg:prose-lg mx-auto py-12">
      <MDXRemote source={fileContent} />
    </div>
  );
}
