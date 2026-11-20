import React, { createContext } from 'react';
import useAuth from '../Hook/useAuth';


export const AuthContext = createContext(null);

const AuthProvidor = ({ children }) => {
  const allContext = useAuth();

  return (
    <AuthContext.Provider value={allContext}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvidor;