import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { PenSquare, User, LogOut, Home, Menu, X } from 'lucide-react';

const NavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition ${className}`}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    // Prevent background scroll when menu open
    if (open) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // When closing, return focus to menu button
  useEffect(() => {
    if (!open && menuButtonRef.current) {
      menuButtonRef.current.focus();
    } else if (open && panelRef.current) {
      // move focus to first focusable element in panel
      const focusable = panelRef.current.querySelector('a,button');
      if (focusable) focusable.focus();
    }
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const onLinkClick = (to) => {
    setOpen(false);
    // optionally navigate manually if needed
    // navigate(to);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-gray-600 transition">
            <PenSquare className="w-7 h-7" />
            <span className="hidden sm:inline">BlogSpace</span>
          </Link>

          {/* Desktop / md+ links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <PenSquare className="w-5 h-5" />
                  <span>Create Post</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center">
            <button
              ref={menuButtonRef}
              aria-controls="mobile-menu"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile off-canvas panel */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 md:hidden pointer-events-none`}
      >
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        />

        {/* sliding panel */}
        <div
          ref={panelRef}
          className={`fixed right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-lg transform transition-transform duration-300 ease-out
            ${open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center space-x-2 text-lg font-bold text-gray-800">
                <PenSquare className="w-6 h-6" />
                <span>BlogSpace</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-1">
                <li>
                  <NavLink to="/" onClick={() => onLinkClick('/')}>
                    <div className="flex items-center space-x-2">
                      <Home className="w-5 h-5" />
                      <span>Home</span>
                    </div>
                  </NavLink>
                </li>

                {isAuthenticated ? (
                  <>
                    <li>
                      <NavLink to="/create" onClick={() => onLinkClick('/create')}>
                        <div className="flex items-center space-x-2">
                          <PenSquare className="w-5 h-5" />
                          <span>Create Post</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/profile" onClick={() => onLinkClick('/profile')}>
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>{user?.username || 'Profile'}</span>
                        </div>
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <NavLink to="/login" onClick={() => onLinkClick('/login')}>Login</NavLink>
                    </li>
                    <li>
                      <NavLink to="/register" onClick={() => onLinkClick('/register')}>Register</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <div className="mt-4 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} BlogSpace</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
