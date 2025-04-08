/**
 * Utility functions for generating and managing user avatars
 * Using DiceBear API for default avatars: https://www.dicebear.com/styles
 */

/**
 * Available DiceBear avatar styles
 * See all options at: https://www.dicebear.com/styles
 */
export enum AvatarStyle {
  PIXEL_ART = 'pixelart',
  AVATAAARS = 'avataaars',
  BOTTTS = 'bottts',
  IDENTICON = 'identicon',
  INITIALS = 'initials',
  ADVENTURER = 'adventurer',
  MICAH = 'micah',
  THUMBS = 'thumbs',
  LORELEI = 'lorelei'
}

export const DEFAULT_AVATAR_STYLE = AvatarStyle.ADVENTURER;

/**
 * Generate a DiceBear avatar URL
 * 
 * @param seed Unique string to generate the avatar (usually user ID or username)
 * @param style Avatar style to use
 * @param options Additional options for the avatar generation
 * @returns URL to the generated avatar
 */
export const generateAvatarUrl = (
  seed: string,
  style: AvatarStyle = DEFAULT_AVATAR_STYLE,
  options: Record<string, string | number | boolean> = {}
): string => {
  // Base URL for DiceBear API
  const baseUrl = `https://api.dicebear.com/7.x/${style}/svg`;
  
  // Convert options to URL parameters
  const optionsParams = Object.entries(options)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  // Build the final URL
  const url = `${baseUrl}?seed=${encodeURIComponent(seed)}${optionsParams ? `&${optionsParams}` : ''}`;
  
  return url;
};

/**
 * Generates a color based on user ID for consistent user-specific colors
 * 
 * @param userId User ID to generate color for
 * @returns Hex color code
 */
export const generateUserColor = (userId: string): string => {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // LKHN color palette - vibrant colors that fit the brand
  const colors = [
    '#45B26B', // Green
    '#2D81FF', // Blue
    '#6E56CF', // Purple
    '#E44A66', // Red
    '#FFB930', // Yellow
    '#FF5C00', // Orange
    '#00C8BC', // Teal
    '#8E24AA', // Deep Purple
    '#00ACC1', // Cyan
    '#5E35B1'  // Indigo
  ];
  
  // Use the hash to select a color from the palette
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

/**
 * Get user avatar source - either their custom uploaded avatar or a generated DiceBear avatar
 * 
 * @param userId User ID 
 * @param displayName User's display name
 * @param photoURL Custom uploaded photo URL (if any)
 * @param style Avatar style to use for generated avatars
 * @returns URL to the user's avatar
 */
export const getUserAvatarSrc = (
  userId: string,
  displayName: string,
  photoURL?: string,
  style: AvatarStyle = DEFAULT_AVATAR_STYLE
): string => {
  // If user has a custom avatar, use it
  if (photoURL) {
    return photoURL;
  }
  
  // Otherwise generate a DiceBear avatar
  // Use a combination of userId and display name for more variety
  const seed = `${userId}-${displayName}`;
  
  // Options for the avatar
  const options = {
    background: generateUserColor(userId).replace('#', ''),
    radius: 50, // Rounded corners
  };
  
  return generateAvatarUrl(seed, style, options);
};