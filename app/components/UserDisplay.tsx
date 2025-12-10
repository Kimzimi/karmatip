'use client';

import { UserProfile } from '@/lib/userProfile';

interface UserDisplayProps {
  profile: UserProfile;
  size?: 'sm' | 'md' | 'lg';
  showAddress?: boolean;
}

export default function UserDisplay({ profile, size = 'md', showAddress = false }: UserDisplayProps) {
  const sizeClasses = {
    sm: { avatar: 'w-8 h-8', text: 'text-sm', subtext: 'text-xs' },
    md: { avatar: 'w-12 h-12', text: 'text-base', subtext: 'text-sm' },
    lg: { avatar: 'w-16 h-16', text: 'text-lg', subtext: 'text-base' },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center space-x-3">
      <img
        src={profile.avatar}
        alt={profile.displayName || 'User avatar'}
        className={`${classes.avatar} rounded-full bg-gradient-to-br from-purple-400 to-pink-400`}
      />
      <div>
        <div className={`font-semibold text-gray-800 ${classes.text}`}>
          {profile.displayName}
        </div>
        {showAddress && !profile.username && (
          <div className={`text-gray-600 font-mono ${classes.subtext}`}>
            {profile.address.slice(0, 10)}...{profile.address.slice(-8)}
          </div>
        )}
      </div>
    </div>
  );
}
