import { CommentScore } from '@/ai/dto/review-comment.ai.dto';
import { reviewComment } from '@/ai/review-comment';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { postId, userId, content } = await request.json();

  if (!postId || !content) {
    return NextResponse.json(
      { message: 'Post ID and content are required.' },
      { status: 400 },
    );
  }

  let commentStatus = 'pending';

  const post = await prisma.post.findFirstOrThrow({
    where: { id: postId },
  });

  // use ai to review comment... approve? ban user
  const review = await reviewComment({
    postTitle: post.title,
    postMetaDescription: post.metaDescription,
    comment: content,
  });

  if (review.score === CommentScore.Good) {
    commentStatus = 'approved';
  } else if (review.score === CommentScore.VeryBad) {
    // suspend user
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: userId || null,
        status: commentStatus,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create comment.' },
      { status: 500 },
    );
  }
}
