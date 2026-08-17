'use client';

import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import { Comment } from '../../types/types';

interface ReplyListProps {
  commentId: string;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
  currentUserId?: string;
  token?: string;
}

export default function ReplyList({
  commentId,
  onDelete,
  onLike,
  onDislike,
  currentUserId,
  token
}: ReplyListProps) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/replies/${commentId}?page=1&limit=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }

      const data = await response.json();
      setReplies(data.replies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onDelete={onDelete}
          onLike={onLike}
          onDislike={onDislike}
          currentUserId={currentUserId}
          token={token}
        />
      ))}
    </div>
  );
}