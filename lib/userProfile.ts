// User profile utilities for displaying user info instead of raw addresses

export interface UserProfile {
  address: string;
  username?: string;
  avatar?: string;
  displayName?: string;
}

/**
 * Format address to display format
 * Shows first 6 and last 4 characters
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get user avatar URL from address or username
 * Uses multiple fallback services
 */
export function getUserAvatar(address: string, username?: string): string {
  // If we have a username from Frame context, try to use Farcaster avatar
  if (username) {
    // Use Airstack API or similar to get Farcaster avatar
    // For now, we'll use a placeholder
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  }

  // Fallback to address-based avatar
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
}

/**
 * Get display name for user
 * Prioritizes username over formatted address
 */
export function getDisplayName(address: string, username?: string): string {
  if (username) {
    return `@${username}`;
  }
  return formatAddress(address);
}

/**
 * Create a user profile object from available data
 */
export function createUserProfile(
  address: string,
  username?: string,
  avatar?: string
): UserProfile {
  return {
    address,
    username,
    avatar: avatar || getUserAvatar(address, username),
    displayName: getDisplayName(address, username),
  };
}
