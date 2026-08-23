import React from 'react';
import Sidebar from '../Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex bg-[#121315] min-h-screen text-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-[280px] overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}