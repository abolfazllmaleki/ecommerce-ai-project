// 'use client';

// import { useState } from 'react';
// import CommentForm from './CommentForm';
// import ReplyList from './ReplyList';
// import { Comment } from '../../types/types';

// interface CommentItemProps {
//   comment: Comment;
//   onDelete: (commentId: string) => void;
//   onLike: (commentId: string) => void;
//   onDislike: (commentId: string) => void;
//   currentUserId?: string;
//   token?: string;
// }

// export default function CommentItem({
//   comment,
//   onDelete,
//   onLike,
//   onDislike,
//   currentUserId,
//   token
// }: CommentItemProps) {
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [showReplies, setShowReplies] = useState(false);
  
//   const user = typeof comment.userId === 'string' ? undefined : comment.userId;
//   const userName = user ? `${user.name} ${user.lastName || ''}`.trim() : 'Anonymous User';
  
//   const isOwner = currentUserId && (
//     typeof comment.userId === 'string' 
//       ? comment.userId === currentUserId 
//       : user?.id === currentUserId
//   );

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
//             {userName[0]?.toUpperCase() || 'U'}
//           </div>
//         </div>
        
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center space-x-2">
//               <span className="font-semibold text-gray-900">{userName}</span>
//               <span className="text-sm text-gray-500">•</span>
//               <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
//             </div>
            
//             {isOwner && (
//               <button
//                 onClick={() => onDelete(comment._id)}
//                 className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
//               >
//                 Delete
//               </button>
//             )}
//           </div>
          
//           <p className="text-gray-800 mb-4 leading-relaxed">{comment.content}</p>
          
//           <div className="flex items-center space-x-6">
//             <button
//               onClick={() => onLike(comment._id)}
//               disabled={!currentUserId}
//               className={`flex items-center space-x-1 ${
//                 comment.hasLiked 
//                   ? 'text-blue-600' 
//                   : 'text-gray-500 hover:text-blue-600'
//               } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
//             >
//               <span>👍</span>
//               <span className="text-sm">{comment.likes}</span>
//             </button>
            
//             <button
//               onClick={() => onDislike(comment._id)}
//               disabled={!currentUserId}
//               className={`flex items-center space-x-1 ${
//                 comment.hasDisliked 
//                   ? 'text-red-600' 
//                   : 'text-gray-500 hover:text-red-600'
//               } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
//             >
//               <span>👎</span>
//               <span className="text-sm">{comment.dislikes}</span>
//             </button>
            
//             <button
//               onClick={() => setShowReplyForm(!showReplyForm)}
//               disabled={!currentUserId}
//               className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50 transition-colors"
//             >
//               Reply
//             </button>
            
//             {comment.replyCount > 0 && (
//               <button
//                 onClick={() => setShowReplies(!showReplies)}
//                 className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
//               >
//                 {showReplies ? 'Hide replies' : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
//               </button>
//             )}
//           </div>
          
//           {showReplyForm && token && (
//             <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
//               <CommentForm
//                 productId={comment.productId}
//                 parentCommentId={comment._id}
//                 onCommentAdded={() => {
//                   setShowReplyForm(false);
//                   setShowReplies(true);
//                 }}
//                 onCancel={() => setShowReplyForm(false)}
//                 token={token}
//               />
//             </div>
//           )}
          
//           {showReplies && comment.replyCount > 0 && (
//             <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
//               <ReplyList
//                 commentId={comment._id}
//                 onDelete={onDelete}
//                 onLike={onLike}
//                 onDislike={onDislike}
//                 currentUserId={currentUserId}
//                 token={token}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import CommentForm from './CommentForm';
// import ReplyList from './ReplyList';
// import { Comment } from '../../types/types';

// interface CommentItemProps {
//   comment: Comment;
//   onDelete: (commentId: string) => void;
//   onLike: (commentId: string) => void;
//   onDislike: (commentId: string) => void;
//   currentUserId?: string;
//   token?: string;
//   userRating?: number; // Add user rating to props
// }

// // Star Rating Component
// const StarRating = ({ rating }: { rating: number }) => {
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 >= 0.5;
  
//   return (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, i) => (
//         <svg
//           key={i}
//           className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-300'}`}
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           {i < fullStars ? (
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           ) : i === fullStars && hasHalfStar ? (
//             <path d="M10 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
//           ) : (
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           )}
//         </svg>
//       ))}
//       <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
//     </div>
//   );
// };

// // Like and Dislike SVG Icons
// const LikeIcon = ({ filled }: { filled: boolean }) => (
//   <svg 
//     className={`w-5 h-5 ${filled ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
//     fill={filled ? 'currentColor' : 'none'}
//     stroke="currentColor" 
//     viewBox="0 0 24 24" 
//     strokeWidth="1.5"
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
//   </svg>
// );

// const DislikeIcon = ({ filled }: { filled: boolean }) => (
//   <svg 
//     className={`w-5 h-5 ${filled ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
//     fill={filled ? 'currentColor' : 'none'}
//     stroke="currentColor" 
//     viewBox="0 0 24 24" 
//     strokeWidth="1.5"
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.763 15H17m0 0v5a2 2 0 01-2 2h-2.5" />
//   </svg>
// );

// export default function CommentItem({
//   comment,
//   onDelete,
//   onLike,
//   onDislike,
//   currentUserId,
//   token,
//   userRating // Get the user rating from props
// }: CommentItemProps) {
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [showReplies, setShowReplies] = useState(false);
  
//   const user = typeof comment.userId === 'string' ? undefined : comment.userId;
//   const userName = user ? `${user.name} ${user.lastName || ''}`.trim() : 'Anonymous User';
  
//   const isOwner = currentUserId && (
//     typeof comment.userId === 'string' 
//       ? comment.userId === currentUserId 
//       : user?.id === currentUserId
//   );

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
//             {userName[0]?.toUpperCase() || 'U'}
//           </div>
//         </div>
        
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center space-x-2">
//               <span className="font-semibold text-gray-900">{userName}</span>
//               <span className="text-sm text-gray-500">•</span>
//               <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
//             </div>
            
//             {isOwner && (
//               <button
//                 onClick={() => onDelete(comment._id)}
//                 className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
//               >
//                 Delete
//               </button>
//             )}
//           </div>
          
//           {/* Display user's rating if available */}
//           {userRating !== undefined && userRating > 0 && (
//             <div className="mb-2">
//               <StarRating rating={userRating} />
//             </div>
//           )}
          
//           <p className="text-gray-800 mb-4 leading-relaxed">{comment.content}</p>
          
//           <div className="flex items-center space-x-6">
//             <button
//               onClick={() => onLike(comment._id)}
//               disabled={!currentUserId}
//               className={`flex items-center space-x-1 ${
//                 comment.hasLiked 
//                   ? 'text-blue-600' 
//                   : 'text-gray-500 hover:text-blue-600'
//               } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
//             >
//               <LikeIcon filled={comment.hasLiked} />
//               <span className="text-sm">{comment.likes}</span>
//             </button>
            
//             <button
//               onClick={() => onDislike(comment._id)}
//               disabled={!currentUserId}
//               className={`flex items-center space-x-1 ${
//                 comment.hasDisliked 
//                   ? 'text-red-600' 
//                   : 'text-gray-500 hover:text-red-600'
//               } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
//             >
//               <DislikeIcon filled={comment.hasDisliked} />
//               <span className="text-sm">{comment.dislikes}</span>
//             </button>
            
//             <button
//               onClick={() => setShowReplyForm(!showReplyForm)}
//               disabled={!currentUserId}
//               className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50 transition-colors"
//             >
//               Reply
//             </button>
            
//             {comment.replyCount > 0 && (
//               <button
//                 onClick={() => setShowReplies(!showReplies)}
//                 className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
//               >
//                 {showReplies ? 'Hide replies' : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
//               </button>
//             )}
//           </div>
          
//           {showReplyForm && token && (
//             <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
//               <CommentForm
//                 productId={comment.productId}
//                 parentCommentId={comment._id}
//                 onCommentAdded={() => {
//                   setShowReplyForm(false);
//                   setShowReplies(true);
//                 }}
//                 onCancel={() => setShowReplyForm(false)}
//                 token={token}
//               />
//             </div>
//           )}
          
//           {showReplies && comment.replyCount > 0 && (
//             <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
//               <ReplyList
//                 commentId={comment._id}
//                 onDelete={onDelete}
//                 onLike={onLike}
//                 onDislike={onDislike}
//                 currentUserId={currentUserId}
//                 token={token}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import ReplyList from './ReplyList';
import { Comment } from '../../types/types';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
  currentUserId?: string;
  token?: string;
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {i < fullStars ? (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          ) : i === fullStars && hasHalfStar ? (
            <path d="M10 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          )}
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

// Like and Dislike SVG Icons
const LikeIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const DislikeIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.763 15H17m0 0v5a2 2 0 01-2 2h-2.5" />
  </svg>
);

export default function CommentItem({
  comment,
  onDelete,
  onLike,
  onDislike,
  currentUserId,
  token
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  
  const user = typeof comment.userId === 'string' ? undefined : comment.userId;
  const userName = user ? `${user.name} ${user.lastName || ''}`.trim() : 'Anonymous User';
  
  const isOwner = currentUserId && (
    typeof comment.userId === 'string' 
      ? comment.userId === currentUserId 
      : user?.id === currentUserId
  );

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user?._id || !comment.productId) return;
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user._id}/product/${comment.productId}`
        );

        
        if (response.ok) {
          const ratingData = await response.json();
                  console.log(ratingData)

          setUserRating(ratingData.rating || null);
        }
      } catch (error) {
        console.error('Failed to fetch user rating:', error);
      }
    };

    fetchUserRating();
  }, [user, comment.productId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
            {userName[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{userName}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            
            {isOwner && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          
          {/* Display user's rating if available */}
          {userRating !== null && userRating > 0 && (
            <div className="mb-2">
              <StarRating rating={userRating} />
            </div>
          )}
          
          <p className="text-gray-800 mb-4 leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(comment._id)}
              disabled={!currentUserId}
              className={`flex items-center space-x-1 ${
                comment.hasLiked 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-blue-600'
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <LikeIcon filled={comment.hasLiked} />
              <span className="text-sm">{comment.likes}</span>
            </button>
            
            <button
              onClick={() => onDislike(comment._id)}
              disabled={!currentUserId}
              className={`flex items-center space-x-1 ${
                comment.hasDisliked 
                  ? 'text-red-600' 
                  : 'text-gray-500 hover:text-red-600'
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <DislikeIcon filled={comment.hasDisliked} />
              <span className="text-sm">{comment.dislikes}</span>
            </button>
            
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              disabled={!currentUserId}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50 transition-colors"
            >
              Reply
            </button>
            
            {comment.replyCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                {showReplies ? 'Hide replies' : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
              </button>
            )}
          </div>
          
          {showReplyForm && token && (
            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
              <CommentForm
                productId={comment.productId}
                parentCommentId={comment._id}
                onCommentAdded={() => {
                  setShowReplyForm(false);
                  setShowReplies(true);
                }}
                onCancel={() => setShowReplyForm(false)}
                token={token}
              />
            </div>
          )}
          
          {showReplies && comment.replyCount > 0 && (
            <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
              <ReplyList
                commentId={comment._id}
                onDelete={onDelete}
                onLike={onLike}
                onDislike={onDislike}
                currentUserId={currentUserId}
                token={token}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}