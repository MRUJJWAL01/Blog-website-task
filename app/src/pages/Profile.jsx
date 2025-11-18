import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Edit, Trash2, User } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // ensure setUser exists
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, postId: null });

  // avatar upload state
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserPosts();
    // cleanup not needed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/post', {
        params: { search: user?.username, page: 1, limit: 100 }
      });
      setPosts(response.data.items || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      setSuccess('Post deleted successfully');
      setDeleteModal({ show: false, postId: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // ---------- Immediate avatar upload ----------
  const onAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileChange = async (e) => {
    const f = e.target.files[0];
    console.log(f);
    
    if (!f) return;

    // Basic validation
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file.');
      e.target.value = '';
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Image too large (max 5MB).');
      e.target.value = '';
      return;
    }

    // Immediately upload
    const fd = new FormData();
    fd.append('images', f);

    try {
      setUploading(true);
      setError(null);

      const res = await api.post('/api/user/profile-picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Expect updated user object in response
      const updatedUser = res.data.user || res.data;
      if (updatedUser) {
        setUser(updatedUser); // update AuthContext so UI reflects new avatar
        setSuccess('Profile picture updated');
      } else {
        setSuccess('Uploaded successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = ''; // clear input so same file can be selected again if needed
    }
  };

  // ---------- UI ----------
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-4">
            {/* Clickable avatar */}
            <div
              onClick={onAvatarClick}
              className="w-20 h-20 bg-blue-100 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden"
              title="Click to change profile picture"
            >
              {/* avatar image or fallback icon */}
              {user.dp ? (
                <img src={user.dp} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-blue-600" />
              )}

              {/* uploading overlay */}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}//
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">{posts.length} posts</p>
            </div>
          </div>
        </div>

        {/* rest of profile: posts list */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">No posts yet</p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row">
                  {post.imageURL && (
                    <div className="md:w-48 h-48 overflow-hidden">
                      <img
                        src={Array.isArray(post.imageURL) ? post.imageURL[0] : post.imageURL}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3
                          onClick={() => navigate(`/posts/${post._id}`)}
                          className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition"
                        >
                          {post.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                        <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => navigate(`/edit/${post._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-lg transition"
                          title="Edit post"
                        >
                          <Edit className="w-5 h-5 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, postId: post._id })}
                          className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition"
                          title="Delete post"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteModal({ show: false, postId: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.postId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
