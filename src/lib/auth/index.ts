export type DatabaseUserAttributes = {
  githubId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  admin: boolean;
};

export type AuthMethod = 'email' | 'github';

export const signInRedirect = '/home';
export const signUpRedirect = '/home';
export const signOutRedirect = '/';
export const signInPath = '/sign-in';
export const signUpPath = '/sign-up';
