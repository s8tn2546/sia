import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const Navbar = ({ onMenuClick, title = '' }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const response = await api.getNotifications();
      setNotifications(response?.data?.notifications || []);
      setUnreadCount(Number(response?.data?.unreadCount || 0));
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const userData = {
    name: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
    role: 'Supply Chain Manager',
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await api.markNotificationRead(notification._id);
      await loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    await loadNotifications();
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-bg-secondary rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page Title */}
        {title && (
          <h1 className="text-xl font-display font-semibold text-text-primary hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpenNotifications((prev) => !prev)}
            className="relative p-2 hover:bg-bg-secondary rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {openNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-large z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-medium text-text-primary">Notifications</h3>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-primary hover:text-primary-hover"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-text-secondary">No notifications yet.</p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-4 py-3 border-b border-border/60 hover:bg-bg-secondary transition-colors ${
                        notification.read ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!notification.read && (
                          <span className="w-2 h-2 mt-1.5 bg-primary rounded-full"></span>
                        )}
                        <div>
                          <p className="text-sm font-medium text-text-primary">{notification.title}</p>
                          <p className="text-xs text-text-secondary mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-text-primary">{userData.name}</p>
            <p className="text-xs text-text-secondary">{userData.role}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {userData.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Log out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
