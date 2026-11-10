import React, { createContext, useContext } from 'react';
import useUserStats from '../Hook/useUserStats';
import useAuthInfo from '../Hook/useAuthInfo';

const UserStatsContext = createContext(null);

export const UserStatsProvider = ({ children }) => {
  const { user } = useAuthInfo();
  // Custom Hook theke data niye Context-e bhoral
  const stats = useUserStats(user);

  return (
    <UserStatsContext.Provider value={stats}>
      {children}
    </UserStatsContext.Provider>
  );
};

// Custom Hook to consume Context easily
export const useUserStatsContext = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error('useUserStatsContext must be used within a UserStatsProvider');
  }
  return context;
};