'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import SimytLogo from '../../ui/simyt-logo';
import { PowerIcon } from '../../../public/outline';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function SideNav() {
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await fetch('https://www.simytsoacha.somee.com/api/People/Logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        Cookies.remove('Token');
        Cookies.remove('Name');
        Cookies.remove('Type');
        Cookies.remove('TypeId');
        router.push('/');
      } else {
        console.error('Error logging out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <SimytLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <button
          onClick={logout}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </div>
    </div>
  );
}
