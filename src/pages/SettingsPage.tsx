import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Bell, Shield, Lock, User, LogOut, Languages, Database } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import FirebaseTest from '../components/common/FirebaseTest';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'language', label: 'Language & Region', icon: <Languages size={16} /> },
    { id: 'diagnostics', label: 'System Diagnostics', icon: <Database size={16} /> }
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span className="text-sm">Back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-white mt-4 mb-2">Settings</h1>
        <p className="text-neutral-300">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="bg-navy-800 border border-navy-700 rounded-sm p-4">
          <ul className="space-y-1">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-sm ${
                    activeTab === tab.id 
                      ? 'bg-navy-700 text-gold' 
                      : 'text-neutral-200 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
            
            <li className="pt-4 mt-4 border-t border-navy-700">
              <button
                className="w-full flex items-center px-3 py-2 rounded-sm text-red-400 hover:bg-red-900/20"
              >
                <LogOut size={16} className="mr-3" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
        
        {/* Settings Content */}
        <div className="bg-navy-800 border border-navy-700 rounded-sm p-4 md:col-span-2">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-white">Profile Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy-700 border border-navy-600 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    placeholder="Your display name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-navy-700 border border-navy-600 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-gold/50"
                    placeholder="Your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Bio</label>
                  <textarea 
                    className="w-full bg-navy-700 border border-navy-600 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-gold/50 h-24"
                    placeholder="Write a short bio"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="flex items-center bg-gold hover:bg-gold-600 text-navy-900 px-4 py-2 rounded-sm">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'diagnostics' && (
            <div>
              <h2 className="text-lg font-medium text-white mb-4">System Diagnostics</h2>
              <FirebaseTest />
            </div>
          )}
          
          {activeTab !== 'profile' && activeTab !== 'diagnostics' && (
            <div className="flex items-center justify-center h-64 border border-dashed border-navy-600 rounded-sm">
              <div className="text-center">
                <p className="text-neutral-300 mb-1">{tabs.find(t => t.id === activeTab)?.label}</p>
                <p className="text-neutral-400 text-sm">Coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;