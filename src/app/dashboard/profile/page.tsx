import { UserProfile } from '@clerk/nextjs';
import React from 'react';

const Profile  = () => {
  return (
    <div className=' flex items-center justify-center min-h-screen bg-slate-100 m-5'>
      <UserProfile routing="hash" />
    </div>
  );
};

export default Profile ;
