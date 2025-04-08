import React from 'react';
import { Clock, Activity as ActivityIcon, User, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useUser } from '../../contexts/UserContext';
import Card from '../common/Card';

const ActivityLog: React.FC = () => {
  const { recentActivity } = useUser();
  const { t } = useTranslation();
  
  if (!recentActivity || recentActivity.length === 0) {
    return (
      <div className="text-center py-12">
        <ActivityIcon size={40} className="mx-auto mb-4 text-gray-500" />
        <h4 className="text-lg font-medium mb-2">{t('profile.noActivity')}</h4>
        <p className="text-gray-400">{t('profile.activityEmpty')}</p>
      </div>
    );
  }
  
  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile_update':
        return <User size={16} className="text-blue-500" />;
      case 'payment':
        return <DollarSign size={16} className="text-green-500" />;
      case 'event':
        return <Calendar size={16} className="text-purple-500" />;
      case 'connection':
        return <User size={16} className="text-yellow-500" />;
      case 'investment':
        return <Briefcase size={16} className="text-red-500" />;
      default:
        return <ActivityIcon size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">{t('profile.activityHistory')}</h3>
      
      <div className="space-y-6">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="relative pl-6 border-l border-gray-800">
            {/* Dot indicator */}
            <div className="absolute left-[-8px] top-0 w-4 h-4 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
            
            {/* Activity content */}
            <div className="mb-1">
              <h4 className="text-base font-medium">{activity.title}</h4>
              <p className="text-sm text-gray-400">{activity.description}</p>
            </div>
            
            {/* Activity timestamp */}
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <Clock size={12} className="mr-1" />
              <span>{new Date(activity.timestamp.toDate()).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityLog;