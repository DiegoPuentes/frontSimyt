'use client';

import { lusitana } from '@/app/ui/fonts';
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon
} from '../../public/outline';
import { ArrowRightIcon } from '../../public/outline';
import { Button } from '../ui/button';

export default function LoginForm() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('https://localhost:7231/api/People/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: new URLSearchParams({
          userName: userName,
          pass: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar el token o el tipo de usuario en localStorage o cookies para usar en las siguientes solicitudes
        localStorage.setItem('token', data.Token);
        console.log(response.status)
        // Redirigir a una página protegida si el login es exitoso
        router.push('/dashboard');
      } else if (response.status === 404) {
        setErrorMessage('Incorrect username or password.');
      } else if (response.status === 400) {
        setErrorMessage('Username or password cannot be empty.');
      } else {
        setErrorMessage('An error has occurred.');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server.' + error);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-base font-medium text-gray-900" htmlFor="user">
              User
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 
                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                id="user"
                type="text"
                name="user"
                placeholder="Enter your user"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <UserIcon className="pointer-events-none absolute 
              left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-base font-medium text-gray-900" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 
                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] 
              w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white text-base py-2 rounded-md">
          Log in
        </button>
        {errorMessage && <p className="text-red-500 text-base mt-2">{errorMessage}</p>}
      </div>
    </form>
  );
}
