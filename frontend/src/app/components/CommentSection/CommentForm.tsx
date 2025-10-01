'use client';

import { useState } from 'react';

interface CommentFormProps {
  productId: string;
  onCommentAdded: (comment: any) => void;
  parentCommentId?: string;
  onCancel?: () => void;
  token: string;
}

export default function CommentForm({ 
  productId, 
  onCommentAdded, 
  parentCommentId,
  onCancel,
  token
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            content: content.trim(),
            parentCommentId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const newComment = await response.json();
      onCommentAdded(newComment);
      setContent('');
      
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentCommentId ? "Write your response..." : "Share your thoughts..."}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-colors"
            disabled={loading}
          />
          
          <div className="flex justify-end space-x-3 mt-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Sending...' : parentCommentId ? 'Post Reply' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}