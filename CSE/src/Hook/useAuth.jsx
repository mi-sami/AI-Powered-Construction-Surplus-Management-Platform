import { useState } from 'react';

const useAuth = () => {

    
  // LocalStorage থেকে আগের সেভ হওয়া ইউজার ইনিশিয়ালাইজ করা
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return {
    user,
    setUser,
  };
};

export default useAuth;