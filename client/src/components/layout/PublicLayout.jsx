import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0faff] text-[#001f3f]">
      <PublicNavbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
};
