import Link from "next/link";
import { listPosts } from "@/lib/data/posts";

interface BlogPageProps {
  params: Promise<{ country: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { country, locale } = await params;
  const { page: pageParam } = await searchParams;
  const basePath = `/${country}/${locale}`;

  const page = Number(pageParam) || 1;
  const { data: posts, meta } = await listPosts(page);

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">
        Stories, guides, and updates from NOZ Fragrances.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">
          No posts published yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`${basePath}/blog/${post.slug}`}
              className="block group"
            >
              {post.image_url && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {post.category && (
                <span className="text-xs font-medium uppercase tracking-wide text-[#F07867]">
                  {post.category.title}
                </span>
              )}
              <h2 className="text-lg font-medium text-gray-900 mt-1.5 mb-2 group-hover:underline">
                {post.title}
              </h2>
              <time className="text-xs text-gray-400 block mb-2">
                {new Date(post.published_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </Link>
          ))}
        </div>
      )}

      {meta.pages > 1 && (
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`${basePath}/blog?page=${p}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                p === page
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
