import { useState } from 'react';
import { mockUserData } from '../data/mockData';

const Profile = () => {
  const [userData] = useState(mockUserData);
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
          Manage your account settings
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

      {/* Account Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
          Account Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <p className="font-medium text-text-primary">Email Notifications</p>
                <p className="text-sm text-text-secondary">Receive updates about shipments and alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-medium text-text-primary">Change Password</p>
                <p className="text-sm text-text-secondary">Update your password securely</p>
              </div>
            </div>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              Update
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div>
                <p className="font-medium text-text-primary">Logout</p>
                <p className="text-sm text-text-secondary">Sign out of your account</p>
              </div>
            </div>
            <button className="text-sm font-medium text-red-600 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
          API Access
        </h3>
        <div className="bg-bg-secondary rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-text-primary">API Key</p>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              Regenerate
            </button>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-white px-4 py-3 rounded-lg font-mono text-sm text-text-secondary overflow-x-auto">
              sk_live_51H8K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7
            </code>
            <button className="p-3 hover:bg-bg-secondary rounded-lg transition-colors">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            Use this API key to integrate with your own applications. Keep it secret!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
