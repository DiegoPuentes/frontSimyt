'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ExclamationCircleIcon,
    CalendarIcon,
    UserPlusIcon,
    ClipboardDocumentListIcon,
    IdentificationIcon,
    UserCircleIcon,
    KeyIcon
} from '../../public/outline';

export default function SignForm() {
    const [name, setName] = useState('');
    const [lnames, setLnames] = useState('');
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [nDocument, setnDocument] = useState('');
    const [sex, setSex] = useState<Sex[]>([]);

    const [DateBirth, setDateBirth] = useState('');

    const [UserName, setUserName] = useState('');

    const [passcodes, setpasscodes] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [selectedSex, setSelectedSex] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchDocumentTypes() {
            const response = await fetch('https://www.simytsoacha.somee.com/api/DocType');
            if (response.ok) {
                const data = await response.json();
                setDocumentTypes(data);
            }
        };

        const fetchSex = async () => {
            const response = await fetch('https://www.simytsoacha.somee.com/api/Sex');
            if (response.ok) {
                const data = await response.json();
                setSex(data);
            }
        };

        fetchDocumentTypes();
        fetchSex();
    },
        []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpasscodes(e.target.value);
        validatePasswords(e.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        validatePasswords(passcodes, e.target.value);
    };

    const validatePasswords = (pass: string, confirmPass: string) => {
        const minLength = 8;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (pass.length < minLength) {
            setErrorMessage('The password must be at least 8 characters long.');
            return;
        }
        if (!regex.test(pass)) {
            setErrorMessage('The password must include at least one uppercase letter, one lowercase letter, one number and one symbol.');
            return;
        }
        if (confirmPass && pass !== confirmPass) {
            setErrorMessage('Passwords do not match');
            return;
        }
        setErrorMessage('');

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        if (passcodes !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (!DateBirth) {
            setErrorMessage('Date of birth is required');
            return;
        }

        const data = {
            name: name,
            lnames: lnames,
            dtypeid: selectedDocumentType,
            ndocument: nDocument,
            sex: selectedSex,
            date: new Date(DateBirth).toISOString(),
            utypeid: 2,
            user: UserName,
            password: passcodes,
            isdeleted: false,
        };

        try {
            const response = await fetch('https://localhost:7231/api/People', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/login');
            } else {
                const errorText = await response.text();
                setErrorMessage(errorText);
            }
        } catch (error) {
            setErrorMessage('Error connecting to server: ' + error);
        }
    };


    return (
        <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>Please register here.</h1>
                <div >
                    <label htmlFor="name" className="block text-base font-medium text-gray-900">
                        Names
                    </label>
                    <div className='relative'>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="peer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <UserPlusIcon className="pointer-events-none absolute 
                    left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="lnames" className="block text-base font-medium text-gray-900">
                        Last Names
                    </label>
                    <div className='relative'>
                        <input
                            type="text"
                            id="lnames"
                            placeholder="Enter your last names"
                            required
                            value={lnames}
                            onChange={(e) => setLnames(e.target.value)}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <UserPlusIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="documentType" className="block text-base font-medium text-gray-900">
                        Document Type
                    </label>
                    <div className='relative'>
                        <select
                            id="documentType"
                            value={selectedDocumentType}
                            onChange={(e) => setSelectedDocumentType(e.target.value)}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                            <option value="">Select a type</option>
                            {documentTypes.map((doc) => (
                                <option key={doc.dtypesId} value={doc.dtypesId}>
                                    {doc.dtype}
                                </option>
                            ))}
                        </select>
                        <ClipboardDocumentListIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>

                    </div>
                </div>
                <div>
                    <label htmlFor="nDocument" className="block text-base font-medium text-gray-900">
                        Document Number
                    </label>
                    <div className='relative'>
                        <input
                            type="text"
                            id="nDocument"
                            placeholder="Enter your document number"
                            required
                            value={nDocument}
                            onChange={(e) => setnDocument(e.target.value)}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <IdentificationIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="sex" className="block text-base font-medium text-gray-900">
                        Sex
                    </label>
                    <div className='relative'>
                        <select
                            id="sex"
                            value={selectedSex}
                            onChange={(e) => setSelectedSex(e.target.value)}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                            <option value="">Select a type</option>
                            {sex.map((Sex) => (
                                <option key={Sex.id} value={Sex.id}>
                                    {Sex.preferredSex}
                                </option>
                            ))}
                        </select>
                        <ClipboardDocumentListIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="DateBirth" className="block text-base font-medium text-gray-900">
                        Date Birthday
                    </label>
                    <div className='relative'>
                        <input
                            type="date"
                            id="DateBirth"
                            required
                            value={DateBirth}
                            onChange={(e) => setDateBirth(e.target.value)}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <CalendarIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 
                        peer-focus:text-gray-900"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="UserName" className="block text-base font-medium text-gray-900">
                        User Name
                    </label>
                    <div className='relative'>
                        <input
                            type="UserName"
                            id="UserName"
                            placeholder="Enter your user name"
                            required
                            value={UserName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <UserCircleIcon className='pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 
                        peer-focus:text-gray-900'/>
                    </div>
                </div>
                <div>
                    <label htmlFor="passcodes" className="block text-base font-medium text-gray-900">
                        Password
                    </label>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="passcodes"
                            placeholder="Enter your password"
                            required
                            value={passcodes}
                            onChange={handlePasswordChange}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <KeyIcon className='pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 
                        peer-focus:text-gray-900'/>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-900">
                        Confirm Password
                    </label>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm password"
                            required
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                        />
                        <KeyIcon className='pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 
                        peer-focus:text-gray-900'/>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
                    Sign up
                </button>
                <Link href="/login">
                    <button className="mt-4 w-full bg-blue-500 text-white text-base py-2 rounded-md">
                        Log in
                    </button>
                </Link>
                {errorMessage && (
                    <div className="flex items-center text-red-500">
                        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                        <p className="text-base">{errorMessage}</p>
                    </div>
                )}
            </div>
        </form>
    );
}

interface DocumentType {
    dtypesId: number;
    dtype: string;
}

interface Sex {
    id: number;
    preferredSex: string;
}