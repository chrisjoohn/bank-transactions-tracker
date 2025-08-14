import { createContext } from 'react';

interface AuthContexType {
  authenticated: boolean;
}

export const AuthContext = createContext<Partial<AuthContexType>>({});
