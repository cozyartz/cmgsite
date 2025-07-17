import React from 'react';

const AuthSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Client Portal Login</h1>
        
        <div className="space-y-4">
          <button className="w-full bg-gray-800 text-white py-3 px-4 rounded hover:bg-gray-700">
            Continue with GitHub
          </button>
          
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700">
            Continue with Google
          </button>
          
          <div className="border-t pt-4">
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-3 border rounded"
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 border rounded"
              />
              <button 
                type="submit"
                className="w-full bg-teal-600 text-white py-3 px-4 rounded hover:bg-teal-700"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Test credentials: test@cozyartzmedia.com / TestPass123@
        </p>
      </div>
    </div>
  );
};

export default AuthSimple;