// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://cdserver.nomadsoft.us',
  apiPath: '/api/v1',
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/email/login',
    register: '/auth/email/register',
    googleLogin: '/auth/google/login',
    facebookLogin: '/auth/facebook/login',
    appleLogin: '/auth/apple/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot/password',
    resetPassword: '/auth/reset/password',
    confirmEmail: '/auth/email/confirm',
  },
};