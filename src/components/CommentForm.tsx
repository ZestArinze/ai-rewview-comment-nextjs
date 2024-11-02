'use client';

import { FormEvent, useState } from 'react';

type Props = {
  postId: number;
  userId: number;
};

export function CommentForm(props: Props) {
  const { postId, userId } = props;

  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    setError('');

    if (!content || content.trim().length === 0) {
      setError('Please enter a comment.');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, userId, content }),
      });

      if (!response.ok) {
        throw new Error(`${response.status}. Unable to rewview comment.`);
      }

      setContent('');

      window.location.reload();
    } catch (error: any) {
      setError(error?.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <h3 className="text-xl font-semibold mb-2">Add a comment</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 bg-gray-200 text-gray-950"
        rows={4}
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
}
