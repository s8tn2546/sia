import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const userData = useMemo(() => ({
    name: currentUser?.displayName || 'SIA User',
    email: currentUser?.email || 'not-set@example.com',
    role: 'Supply Chain Manager',
    company: 'SIA',
  }), [currentUser]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    company: userData.company,
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          Profile
        </h1>
        <p className="text-text-secondary">
          Manage your profile
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent-green rounded-full flex items-center justify-center">
            <span className="text-3xl font-display font-semibold text-white">
              {userData.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-display font-semibold text-text-primary mb-1">
              {userData.name}
            </h2>
            <p className="text-text-secondary mb-2">{userData.role}</p>
            <p className="text-sm text-text-secondary">{userData.company}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-medium hover:bg-soft-green transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-border text-text-secondary rounded-xl font-medium hover:bg-bg-secondary transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-bg-secondary rounded-xl p-4">
              <p className="text-xs text-text-secondary mb-1">Email Address</p>
              <p className="font-medium text-text-primary">{userData.email}</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-4">
              <p className="text-xs text-text-secondary mb-1">Role</p>
              <p className="font-medium text-text-primary">{userData.role}</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-4">
              <p className="text-xs text-text-secondary mb-1">Company</p>
              <p className="font-medium text-text-primary">{userData.company}</p>
            </div>
            <div className="bg-bg-secondary rounded-xl p-4">
              <p className="text-xs text-text-secondary mb-1">Member Since</p>
              <p className="font-medium text-text-primary">January 2025</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
