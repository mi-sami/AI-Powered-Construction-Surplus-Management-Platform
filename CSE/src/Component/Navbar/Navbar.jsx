import React from 'react';
import useAuthInfo from '../../Hook/useAuthInfo';
import PublicNavbar from './PublicNavbar';
import AuthNavbar from './AuthNavbar';

const Navbar = () => {
  const { user } = useAuthInfo();

  return user?.email ? <AuthNavbar user={user} /> : <PublicNavbar />;
};

export default Navbar;