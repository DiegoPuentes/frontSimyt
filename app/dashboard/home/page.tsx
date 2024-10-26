import Link from "next/link";

import {
    DocumentDuplicateIcon,
    DocumentMagnifyingGlassIcon,
    PlayIcon,
    UserGroupIcon,
    ArrowRightIcon
} from '../../../public/outline';

export default function Home() {
    return (
        <div className="p-6 bg-gray-50">
            {/* Encabezado */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-bold">¡Hi! </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Here you will be able to manage and follow up on the
                    transit and transport procedures and services that you
                    carry out in Soacha.
                </p>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tarjeta 1: Trámites */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <DocumentMagnifyingGlassIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Procedures</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Request to start the process for virtual attention during our
                            established opening hours.
                        </p>
                        <Link
                            href="/dashboard/procedures"
                            className="flex h-10 items-center justify-center rounded-lg bg-blue-500 
                            px-4 text-base font-medium text-white transition-colors 
                            hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-blue-500 
                            active:bg-blue-600 aria-disabled:cursor-not-allowed 
                            aria-disabled:opacity-50"
                        >
                            <span>Start Here</span> <ArrowRightIcon className="w-5 md:w-6" />
                        </Link>
                    </div>

                </div>

                {/* Tarjeta 2: Solicitudes */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <DocumentDuplicateIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">My Requests</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Check the status of applications you have made.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/requests"
                        className="flex h-10 items-center justify-center rounded-lg bg-blue-500 
                            px-4 text-base font-medium text-white transition-colors 
                            hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-blue-500 
                            active:bg-blue-600 aria-disabled:cursor-not-allowed 
                            aria-disabled:opacity-50"
                    >
                        <span>Check Here</span> <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </div>

                {/* Tarjeta 3: Juego*/}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <PlayIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Game</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Enjoy an entertaining video game about traffic laws and rules in Soacha
                        </p>
                    </div>
                    <Link
                        href="/dashboard/game"
                        className="flex h-10 items-center justify-center rounded-lg bg-blue-500 
                            px-4 text-base font-medium text-white transition-colors 
                            hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-blue-500 
                            active:bg-blue-600 aria-disabled:cursor-not-allowed 
                            aria-disabled:opacity-50"
                    >
                        <span>Game Here</span> <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </div>

                {/* Tarjeta 4: Ayuda */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <UserGroupIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Help</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            If you have a problem with our platform or you need help with the
                            management of a process
                        </p>
                    </div>
                    <Link
                        href="/dashboard/help"
                        className="flex h-10 items-center justify-center rounded-lg bg-blue-500 
                            px-4 text-base font-medium text-white transition-colors 
                            hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 
                            focus-visible:outline-offset-2 focus-visible:outline-blue-500 
                            active:bg-blue-600 aria-disabled:cursor-not-allowed 
                            aria-disabled:opacity-50"
                    >
                        <span>Help Here</span> <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
}