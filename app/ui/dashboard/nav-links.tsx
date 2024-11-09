'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
  PlayIcon,
  ArchiveBoxIcon
} from '../../../public/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from '../../../public/clsx';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function NavLinks() {
  const [userRole, setUserRole] = useState(''); 

  useEffect(() => {
    const cookieType = Cookies.get('Type');

    if (Number(cookieType) === 1) {
      setUserRole('Administrador');
    } else if(Number(cookieType) === 2){
      setUserRole('Usuario'); 
    }else{
      setUserRole('Invitado'); 
    }
  }, []);

  const links = [
    { name: 'Home', href: '/dashboard/home', icon: HomeIcon, roles: ['Administrador'] },
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: ArchiveBoxIcon, 
      roles: ['Administrador'] 
    },
    { 
      name: 'Procedures', 
      href: '/dashboard/procedures', 
      icon: DocumentMagnifyingGlassIcon, 
      roles: ['Administrador', 'Usuario']
    },
    { 
      name: 'My Fines', 
      href: '/dashboard/fines', 
      icon: DocumentDuplicateIcon, 
      roles: ['Administrador', 'Usuario']
    },
    { name: 'Game', href: '/dashboard/game', icon: PlayIcon, roles: ['Administrador', 'Usuario'] },
    { name: 'Help', href: '/dashboard/help', icon: UserGroupIcon, roles: ['Administrador', 'Usuario', 'Invitado'] }
  ];

  const filteredLinks = links.filter(link => link.roles.includes(userRole));

  const pathname = usePathname();
  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
