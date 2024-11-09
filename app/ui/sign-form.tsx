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

    const [acceptsPolicy, setAcceptsPolicy] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    function validateName(name: string) {
        const regex = /^[a-zA-Z ]+$/;
        return regex.test(name);
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newName = event.target.value;
        if (validateName(newName)) {
            setName(newName);
            setErrorMessage("");
            return;
        } else {
            setErrorMessage("The Name field must be a valid name, consisting of letters only.");
            return;
        }
    }

    function handleLnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newLname = event.target.value;
        if (validateName(newLname)) {
            setLnames(newLname);
            setErrorMessage("")
            return;
        } else {
            setErrorMessage("The Name field must be a valid name, consisting of letters only.");
            return;
        }
    }

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

        if (!selectedDocumentType || !selectedSex) {
            setErrorMessage("Fill in all the fields, it is obligatory");
            return;
        }

        if (!acceptsPolicy) {
            setErrorMessage("Please accept the Data Policy to proceed.");
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

        console.log(data);

        try {
            const response = await fetch('https://www.simytsoacha.somee.com/api/People', {
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
                            onChange={handleNameChange}
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
                            onChange={handleLnameChange}
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
                            minLength={10}
                            maxLength={10}
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
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="acceptsPolicy"
                        required
                        checked={acceptsPolicy}
                        onChange={(e) => setAcceptsPolicy(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="acceptsPolicy" className="text-base text-gray-900">
                        I accept the <button type="button" onClick={() => setIsModalOpen(true)} className="text-blue-500 underline">Data Policy</button>
                    </label>
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
            {/* Modal de Tratamiento de Datos */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Data Policy</h2>
                        <p className="text-sm text-gray-700">
                        This Personal Data Processing Policy sets out how data collected by the SimytSoacha application is used and protected. 
                        and protect the data collected by the SimytSoacha application. 
                        The data collected includes basic information, identification data, 
                        contact and security information. This data is used to create 
                        create user accounts, provide services, personalise the experience and comply with legal 
                        comply with legal obligations. Data processing is based on user consent and 
                        consent of the user and compliance with laws. Security measures such as encryption, access control 
                        security measures such as encryption, access control and monitoring are implemented to protect data. 
                        are implemented to protect data. Users have rights to access their data,
                        as well as to lodge complaints. 
                        Data may be transferred to servers in other countries with appropriate security measures. 
                        appropriate security measures. The Policy may be changed, and users will be notified of any changes 
                        will be notified to users. For enquiries, please contact 
                        contactenos@alcaldiasoacha.gov.co
                        </p>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
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