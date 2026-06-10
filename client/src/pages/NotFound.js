import React from 'react';


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500 mt-4">Page not found</p>
      <a href="/" className="mt-6 text-indigo-600 underline">Go home</a>
    </div>
  );
}
