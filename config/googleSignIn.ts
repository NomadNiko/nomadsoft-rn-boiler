// Google Sign-In Configuration
export const GOOGLE_SIGN_IN_CONFIG = {
  // This is your web client ID from Google Cloud Console
  // For Expo Go development, you'll need to use a web client ID
  webClientId: '459247012471-vr309bv56civlr3hdqqm0i796oehlen6.apps.googleusercontent.com',
  
  // For production, you'll also need:
  // iosClientId: 'YOUR_IOS_CLIENT_ID',
  // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  
  // Scopes you want to request
  scopes: ['openid', 'email', 'profile'],
};