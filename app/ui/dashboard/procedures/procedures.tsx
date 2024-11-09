'use client';

import Link from "next/link";
import {
    ArrowRightIcon,
    DocumentPlusIcon
} from '@/public/outline';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Procedure {
    procedureId: number,
    description: string,
    stateId: string,
    states: {
        statesName: string,
    }
    requestId: string,
    requests: {
        people: {
            peopleId: number,
            names: string;
            lnames: string,
        }
        request: string,
        officer: {
            names: string,
        }
    }
}

export default function Procedures() {
    const [procedures, setProcedures] = useState<Procedure[]>([]);

    const PeopleId = Number(Cookies.get('TypeId'));

    useEffect(() => {

        const fetchProcedures = async () => {
            try {
                const response = await fetch('https://www.simytsoacha.somee.com/api/Procedure', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProcedures(data);
                } else {
                    console.error('Error al obtener los datos:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProcedures();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) ? date.toLocaleDateString() : "Fecha no válida";
    };

    return (
        <div className="p-6 bg-gray-50">
            {/* Encabezado */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-bold">Procedures </h1>
                <p className="mt-2 text-lg text-gray-600">
                    In this space, you will be able to view the history of applications, as well as start the process of issuing your traffic licence or drivers licence.
                </p>
            </div>

            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6">Management of procedures</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Names</th>
                                <th className="px-4 py-2">Last Names</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">State</th>
                                <th className="px-4 py-2">Request Date</th>
                                <th className="px-4 py-2">Name Staff Member</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procedures.map((procedure: Procedure) => (
                                procedure.requests.people.peopleId === PeopleId ? (
                                    <tr key={procedure.procedureId} className="bg-gray-100">
                                        <td className="px-4 py-2">{procedure.requests.people.names}</td>
                                        <td className="px-4 py-2">{procedure.requests.people.lnames}</td>
                                        <td className="px-4 py-2">{procedure.description}</td>
                                        <td className="px-4 py-2">{procedure.states.statesName}</td>
                                        <td className="px-4 py-2">{formatDate(procedure.requests.request)}</td>
                                        <td className="px-4 py-2">{procedure.requests.officer.names}</td>
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <DocumentPlusIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Issue Traffic Licence</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Initiate application for the issuance of a traffic licence
                        </p>
                        <Link
                            href="/dashboard/procedures/traffic"
                        >
                            <button className="mt-4 w-full bg-blue-500 text-white text-base py-2 rounded-md flex justify-between items-center px-4">
                                <span>Traffic Licence</span>
                                <ArrowRightIcon className="w-5 md:w-6" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <DocumentPlusIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Issue a Driving Licence</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Apply for a driving licence
                        </p>
                    </div>
                    <Link
                        href="/dashboard/procedures/drive"
                    >
                        <button className="mt-4 w-full bg-blue-500 text-white text-base py-2 rounded-md flex justify-between items-center px-4">
                            <span>Driving Licence</span>
                            <ArrowRightIcon className="w-5 md:w-6" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
