// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import CommentList from './CommentList';
// import CommentForm from './CommentForm';
// import { Comment } from '../../types/types';
// import Link from 'next/link';

// interface CommentSectionProps {
//   productId: string;
// }

// export default function CommentSection({ productId }: CommentSectionProps) {
//   const { token, user } = useAuth();
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchComments = async (pageNum: number = 1) => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/product/${productId}?page=${pageNum}&limit=10`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch comments');
//       }

//       const data = await response.json();
      
//       if (pageNum === 1) {
//         setComments(data.comments);
//       } else {
//         setComments(prev => [...prev, ...data.comments]);
//       }
      
//       setHasMore(data.pagination.page < data.pagination.pages);
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComments(1);
//   }, [productId]);

//   const handleNewComment = (newComment: Comment) => {
//     setComments(prev => [newComment, ...prev]);
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}`,
//         {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to delete comment');
//       }

//       setComments(prev => prev.filter(comment => comment._id !== commentId));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to delete comment');
//     }
//   };

//   const handleLike = async (commentId: string) => {
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}/like`,
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to like comment');
//       }

//       const updatedComment = await response.json();
      
//       setComments(prev => prev.map(comment => 
//         comment._id === commentId ? updatedComment : comment
//       ));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to like comment');
//     }
//   };

//   const handleDislike = async (commentId: string) => {
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}/dislike`,
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to dislike comment');
//       }

//       const updatedComment = await response.json();
      
//       setComments(prev => prev.map(comment => 
//         comment._id === commentId ? updatedComment : comment
//       ));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to dislike comment');
//     }
//   };

//   const loadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchComments(nextPage);
//   };

//   if (loading && comments.length === 0) {
//     return (
//       <div className="animate-pulse bg-red-50 p-6 rounded-lg">
//         <div className="h-6 bg-red-200 rounded w-1/4 mb-6"></div>
//         <div className="space-y-4">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="p-4 border rounded-lg bg-white">
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="w-8 h-8 bg-red-200 rounded-full"></div>
//                 <div className="h-3 bg-red-200 rounded w-1/3"></div>
//               </div>
//               <div className="h-4 bg-red-200 rounded w-full mb-2"></div>
//               <div className="h-4 bg-red-200 rounded w-2/3"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-red-50 rounded-lg shadow-sm border border-red-100 p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         User Comments ({comments.length})
//       </h2>

//       {error && (
//         <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
//           {error}
//         </div>
//       )}

//       {token ? (
//         <CommentForm 
//           productId={productId} 
//           onCommentAdded={handleNewComment}
//           token={token}
//         />
//       ) : (

//         <div className="bg-white p-4 rounded-lg border border-red-200 mb-6 text-center">
//   <p className="text-gray-700 mb-2">You need to log in to leave a comment</p>
//   <a 
//     href="/login" 
//     className="text-red-600 hover:text-red-800 hover:underline font-medium  transition-colors"
//   >
//     Login
//   </a>
// </div>
//       )}

//       <CommentList
//         comments={comments}
//         onDelete={handleDeleteComment}
//         onLike={handleLike}
//         onDislike={handleDislike}
//         loading={loading}
//       />

//       {hasMore && (
//         <div className="text-center mt-6">
//           <button
//             onClick={loadMore}
//             disabled={loading}
//             className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//           >
//             {loading ? 'Loading...' : 'Load More Comments'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { Comment } from '../../types/types';
import Link from 'next/link';

interface CommentSectionProps {
  productId: string;
}

export default function CommentSection({ productId }: CommentSectionProps) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/product/${productId}?page=${pageNum}&limit=10`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setComments(data.comments);
      } else {
        setComments(prev => [...prev, ...data.comments]);
      }
      
      setHasMore(data.pagination.page < data.pagination.pages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [productId]);

  const handleNewComment = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const handleLike = async (commentId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}/like`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const updatedComment = await response.json();

      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: updatedComment.likes, dislikes: updatedComment.dislikes }
          : comment
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like comment');
    }
  };

  const handleDislike = async (commentId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${commentId}/dislike`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to dislike comment');
      }

      const updatedComment = await response.json();

      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: updatedComment.likes, dislikes: updatedComment.dislikes }
          : comment
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dislike comment');
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  if (loading && comments.length === 0) {
    return (
      <div className="animate-pulse bg-red-50 p-6 rounded-lg">
        <div className="h-6 bg-red-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border rounded-lg bg-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-200 rounded-full"></div>
                <div className="h-3 bg-red-200 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-red-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-red-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 rounded-lg shadow-sm border border-red-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        User Comments ({comments.length})
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {token ? (
        <CommentForm 
          productId={productId} 
          onCommentAdded={handleNewComment}
          token={token}
        />
      ) : (
        <div className="bg-white p-4 rounded-lg border border-red-200 mb-6 text-center">
          <p className="text-gray-700 mb-2">You need to log in to leave a comment</p>
          <a 
            href="/login" 
            className="text-red-600 hover:text-red-800 hover:underline font-medium transition-colors"
          >
            Login
          </a>
        </div>
      )}

      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
        onLike={handleLike}
        onDislike={handleDislike}
        loading={loading}
      />

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
}