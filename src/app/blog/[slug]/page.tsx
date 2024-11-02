import { CommentForm } from '@/components/CommentForm';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function PostDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      comments: {
        // where: { status: 'approved' },
        include: {
          user: true,
        },
      },
    },
  });

  // get any user at random for this demo
  const users = await prisma.user.findMany({
    take: 1,
    skip: Math.floor(Math.random() * (await prisma.user.count())),
  });

  if (!post || users.length === 0) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="my-4">
        <Link href={`/`} className="text-blue-600 hover:underline">
          Home
        </Link>
        {` `}
        &raquo;
        {` `}
        <Link href={`/blog`} className="text-blue-600 hover:underline">
          Blog
        </Link>
        {` `}
        &raquo;
        {` `}
        {post.title}
      </div>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="mb-4">{post.metaDescription}</p>
      <div className="mb-6">
        <p>{post.content}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      <div className="space-y-4">
        {post.comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <span
              className={`inline-block px-2 py-0.5 mb-2 text-xs font-medium ${
                comment.status === 'approved'
                  ? 'bg-green-600 text-gray-200'
                  : comment.status === 'very bad'
                  ? 'bg-red-600 text-gray-200'
                  : 'bg-gray-200 text-gray-600'
              }   rounded-full`}
            >
              {comment.status}
            </span>
            <p>{comment.content}</p>
            {comment.user && (
              <p className="text-gray-500">— {comment.user.name}</p>
            )}
          </div>
        ))}
      </div>

      <CommentForm postId={post.id} userId={users[0].id} />
    </div>
  );
}
