import { Outlet } from '@tanstack/react-router';

export function MainLayout() {
  return (
    <div className="flex min-h-[100vh] items-start justify-center overflow-hidden bg-gradient-to-br from-[#0a5c85] via-[#1073a3] to-[#064360] p-4 py-10 w-full relative">
      
      <div className="w-full max-w-6xl flex justify-center">
        <Outlet />
      </div>

    </div>
  );
}