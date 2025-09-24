import React from 'react';

const AuthLayout = ({ children}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4 bg-white relative overflow-hidden">
      
      <div className="absolute top-0 md:left-0 right-0 transform scale-x-[-1] md:scale-x-[1] w-72 h-72">
        <img src="./authPattern.png" alt="pattern" />
      </div>

      <div className="flex flex-col items-start w-full max-w-md px-8 pb-4 relative z-10">
        <img
          src="./logoMeetwiseV3.png"
          className="w-40 sm:w-48 md:w-56 h-auto object-contain mb-2 -ml-8"
          alt="logo"
        />
        <p className="text-left text-sm sm:text-base text-cyan-500 mb-6">
          Never miss a word, Always stay wise
        </p>

        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;