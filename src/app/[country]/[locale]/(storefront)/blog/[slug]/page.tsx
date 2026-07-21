import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data/posts";

interface BlogPostPageProps {
  params: Promise<{ country: string; locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { country, locale, slug } = await params;
  const basePath = `/${country}/${locale}`;

  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <Link
        href={`${basePath}/blog`}
        className="text-sm text-gray-500 hover:text-gray-900 mb-8 block"
      >
        ← Back to Blog
      </Link>

      {post.image_url && (
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {post.category && (
        <Link
          href={`${basePath}/blog?category=${post.category.slug}`}
          className="text-xs font-medium uppercase tracking-wide text-[#F07867] block mb-2"
        >
          {post.category.title}
        </Link>
      )}

      <h1 className="text-3xl font-semibold text-gray-900 mb-3">
        {post.title}
      </h1>

      <time className="text-sm text-gray-400 block mb-8">
        {new Date(post.published_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      {/* biome-ignore lint: rendering trusted rich-text HTML from our own Spree admin */}
      <div
        className="text-gray-700 leading-relaxed [&_a]:text-[#F07867] [&_a]:underline [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || undefined,
  };
}
