import { Link } from 'react-router';
import { Calendar, User } from 'lucide-react';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link
      to={`/posts/${post.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {post.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition">
          {post.title}
        </h2>
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{post.author || post.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
