// 'use client';

// import CommentItem from './CommentItem';
// import { Comment } from '../../types/types';
// import { useAuth } from '@/app/context/AuthContext';

// interface CommentListProps {
//   comments: Comment[];
//   onDelete: (commentId: string) => void;
//   onLike: (commentId: string) => void;
//   onDislike: (commentId: string) => void;
//   loading?: boolean;
// }

// export default function CommentList({
//   comments,
//   onDelete,
//   onLike,
//   onDislike,
//   loading
// }: CommentListProps) {
//   const { token, user } = useAuth();

//   if (comments.length === 0) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         <div className="text-6xl mb-4">💬</div>
//         <p className="text-lg">No comments yet</p>
//         <p className="text-sm mt-2">Be the first to share your thoughts!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {comments.map((comment) => (
//         <CommentItem
//           key={comment._id}
//           comment={comment}
//           onDelete={onDelete}
//           onLike={onLike}
//           onDislike={onDislike}
//           currentUserId={user?._id}
//           token={token}
//         />
//       ))}
      
//       {loading && comments.length > 0 && (
//         <div className="text-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import CommentItem from './CommentItem';
import { Comment } from '../../types/types';
import { useAuth } from '@/app/context/AuthContext';

interface CommentListProps {
  comments: Comment[];
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
  loading?: boolean;
}

export default function CommentList({
  comments,
  onDelete,
  onLike,
  onDislike,
  loading
}: CommentListProps) {
  const { token, user } = useAuth();

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">💬</div>
        <p className="text-lg">No comments yet</p>
        <p className="text-sm mt-2">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onDelete={onDelete}
          onLike={onLike}
          onDislike={onDislike}
          currentUserId={user?._id}
          token={token}
        />
      ))}
      
      {loading && comments.length > 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
}