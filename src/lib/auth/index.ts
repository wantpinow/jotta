export type DatabaseUserAttributes = {
  githubId: number;
  googleId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  admin: boolean;
};

export type AuthMethod = 'email' | 'github' | 'google';

export const signInRedirect = '/home';
export const signUpRedirect = '/home';
export const signOutRedirect = '/';
export const signInPath = '/sign-in';
export const signUpPath = '/sign-up';
