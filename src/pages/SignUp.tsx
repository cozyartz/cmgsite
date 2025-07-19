import React from 'react';
import AuthSupabaseTurnstile from './AuthSupabaseTurnstile';

const SignUp: React.FC = () => {
  return <AuthSupabaseTurnstile defaultMode="signup" />;
};

export default SignUp;