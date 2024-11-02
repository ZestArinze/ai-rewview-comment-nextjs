import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="my-4">
        <Link href={`/`} className="text-blue-600 hover:underline">
          Home
        </Link>{' '}
        &raquo; Blog
      </div>

      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mb-4">{post.metaDescription}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
