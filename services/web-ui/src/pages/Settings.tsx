import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Shield, 
  Bell, 
  Database,
  Palette,
  Key,
  Save,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { useAuthStore } from '../stores/auth';

type TabType = 'profile' | 'security' | 'notifications' | 'system' | 'appearance';

interface UserProfile {
  id: number;
  email: string;
  displayName?: string;
  role: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      browser: boolean;
      audit: boolean;
      lineage: boolean;
    };
  };
}

interface SystemConfig {
  database: {
    host: string;
    port: number;
    name: string;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    mfa: {
      enabled: boolean;
      method: 'totp' | 'sms' | 'email';
    };
  };
  features: {
    lineageTracking: boolean;
    dataMasking: boolean;
    auditLogging: boolean;
    realTimeAlerts: boolean;
  };
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Mock data - in real implementation, these would come from APIs
  const userProfile: UserProfile = {
    id: user?.id || 1,
    email: user?.email || 'admin@lineage.com',
    displayName: 'Admin User',
    role: 'ADMIN',
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        browser: true,
        audit: true,
        lineage: true,
      },
    },
  };

  const systemConfig: SystemConfig = {
    database: {
      host: 'postgres',
      port: 5432,
      name: 'lineage',
    },
    security: {
      sessionTimeout: 3600,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
      mfa: {
        enabled: false,
        method: 'totp',
      },
    },
    features: {
      lineageTracking: true,
      dataMasking: true,
      auditLogging: true,
      realTimeAlerts: true,
    },
  };

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (profile: Partial<UserProfile>) => {
      // Mock API call - would be real in production
      console.log('Updating profile:', profile);
      return Promise.resolve(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwords: { currentPassword: string; newPassword: string }) => {
      // Mock API call - would be real in production
      console.log('Updating password:', passwords);
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: UserProfile['preferences']) => {
      // Mock API call - would be real in production
      console.log('Updating preferences:', preferences);
      return Promise.resolve(preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'security' as TabType, label: 'Security', icon: Shield },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'system' as TabType, label: 'System', icon: Database },
    { id: 'appearance' as TabType, label: 'Appearance', icon: Palette },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < systemConfig.security.passwordPolicy.minLength) {
      alert(`Password must be at least ${systemConfig.security.passwordPolicy.minLength} characters`);
      return;
    }
    updatePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const validatePassword = (password: string) => {
    const policy = systemConfig.security.passwordPolicy;
    const checks = {
      length: password.length >= policy.minLength,
      uppercase: !policy.requireUppercase || /[A-Z]/.test(password),
      lowercase: !policy.requireLowercase || /[a-z]/.test(password),
      numbers: !policy.requireNumbers || /\d/.test(password),
      special: !policy.requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return checks;
  };

  const passwordChecks = validatePassword(newPassword);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and system preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateProfileMutation.mutate({
                  displayName: formData.get('displayName') as string,
                });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="input w-full bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      defaultValue={userProfile.displayName}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={userProfile.role}
                      disabled
                      className="input w-full bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      type="text"
                      value={userProfile.id}
                      disabled
                      className="input w-full bg-gray-50"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="btn btn-primary flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn btn-secondary flex items-center"
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {systemConfig.security.mfa.enabled 
                      ? 'Two-factor authentication is enabled' 
                      : 'Two-factor authentication is disabled'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Method: {systemConfig.security.mfa.method.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setShowMfaModal(true)}
                  className="btn btn-secondary"
                >
                  {systemConfig.security.mfa.enabled ? 'Disable' : 'Enable'} MFA
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout</label>
                  <select className="input w-full max-w-xs">
                    <option value="1800">30 minutes</option>
                    <option value="3600" selected>1 hour</option>
                    <option value="7200">2 hours</option>
                    <option value="14400">4 hours</option>
                  </select>
                </div>
                <button className="btn btn-secondary">Sign Out All Sessions</button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${passwordChecks.length ? 'text-green-500' : 'text-gray-300'}`} />
                  Minimum {systemConfig.security.passwordPolicy.minLength} characters
                </div>
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${passwordChecks.uppercase ? 'text-green-500' : 'text-gray-300'}`} />
                  At least one uppercase letter
                </div>
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${passwordChecks.lowercase ? 'text-green-500' : 'text-gray-300'}`} />
                  At least one lowercase letter
                </div>
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${passwordChecks.numbers ? 'text-green-500' : 'text-gray-300'}`} />
                  At least one number
                </div>
                <div className="flex items-center">
                  <Check className={`h-4 w-4 mr-2 ${passwordChecks.special ? 'text-green-500' : 'text-gray-300'}`} />
                  At least one special character
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updatePreferencesMutation.mutate({
                  ...userProfile.preferences,
                  notifications: {
                    email: formData.get('email') === 'on',
                    browser: formData.get('browser') === 'on',
                    audit: formData.get('audit') === 'on',
                    lineage: formData.get('lineage') === 'on',
                  },
                });
              }}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email"
                        defaultChecked={userProfile.preferences.notifications.email}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Browser Notifications</h3>
                      <p className="text-sm text-gray-500">Show notifications in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="browser"
                        defaultChecked={userProfile.preferences.notifications.browser}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Audit Events</h3>
                      <p className="text-sm text-gray-500">Notify on important audit events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="audit"
                        defaultChecked={userProfile.preferences.notifications.audit}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Lineage Changes</h3>
                      <p className="text-sm text-gray-500">Notify on data lineage updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="lineage"
                        defaultChecked={userProfile.preferences.notifications.lineage}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={updatePreferencesMutation.isPending}
                    className="btn btn-primary"
                  >
                    {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                  <input
                    type="text"
                    value={systemConfig.database.host}
                    disabled
                    className="input w-full bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    value={systemConfig.database.port}
                    disabled
                    className="input w-full bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
                  <input
                    type="text"
                    value={systemConfig.database.name}
                    disabled
                    className="input w-full bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Flags</h2>
              <div className="space-y-4">
                {Object.entries(systemConfig.features).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {enabled ? 'Feature is enabled' : 'Feature is disabled'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Platform Version:</span>
                  <span className="ml-2 text-gray-900">1.0.0</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Node.js Version:</span>
                  <span className="ml-2 text-gray-900">20.19.4</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Database Version:</span>
                  <span className="ml-2 text-gray-900">PostgreSQL 16</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-gray-900">2025-01-15</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updatePreferencesMutation.mutate({
                  ...userProfile.preferences,
                  theme: formData.get('theme') as 'light' | 'dark' | 'auto',
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select name="theme" defaultValue={userProfile.preferences.theme} className="input w-full max-w-xs">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select name="language" defaultValue={userProfile.preferences.language} className="input w-full max-w-xs">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select name="timezone" defaultValue={userProfile.preferences.timezone} className="input w-full max-w-xs">
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={updatePreferencesMutation.isPending}
                    className="btn btn-primary"
                  >
                    {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="input w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="input w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="input w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="btn btn-primary"
                >
                  {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MFA Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {systemConfig.security.mfa.enabled ? 'Disable' : 'Enable'} Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {systemConfig.security.mfa.enabled 
                ? 'Are you sure you want to disable two-factor authentication? This will reduce the security of your account.'
                : 'Two-factor authentication adds an extra layer of security to your account by requiring a second form of verification.'
              }
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMfaModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Mock MFA toggle
                  console.log('Toggling MFA');
                  setShowMfaModal(false);
                }}
                className="btn btn-primary"
              >
                {systemConfig.security.mfa.enabled ? 'Disable' : 'Enable'} MFA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
