import Image from "next/image";
import Link from "next/link";

import {
    DocumentDuplicateIcon,
    DocumentMagnifyingGlassIcon,
    PlayIcon,
    UserGroupIcon,
    ArrowRightIcon
} from '../../../public/outline';

async function getProcedures() {
    try {
        const res = await fetch('https://www.simytsoacha.somee.com/api/People', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Si la respuesta no es 2xx, lanza un error
        if (!res.ok) {
            throw new Error(`Error fetching procedures: ${res.statusText}`);
        }

        // Verifica que haya contenido en la respuesta antes de convertir a JSON
        const text = await res.text();
        if (!text) {
            throw new Error('Response is empty');
        }

        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error('Error fetching procedures:', error);
        return []; // Devuelve un array vacío en caso de error
    }
}

export default async function Procedures() {

    const procedures = await getProcedures();

    return (

        <div className="p-6 bg-gray-50">
            <div>
                <h1>Datos obtenidos de la API</h1>
                <pre>{JSON.stringify(procedures, null, 2)}</pre> {/* Muestra los datos en pantalla */}
            </div>
            {/* Encabezado */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-bold">¡Procedures! </h1>
                <p className="mt-2 text-lg text-gray-600">
                    In this space, you will be able to view the history
                    of applications, as well as start the process of
                    issuing your traffic licence or driver's licence.
                </p>
            </div>

            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6">Employee Management</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procedures.map((procedure: any) => (
                                <tr key={procedure.peopleId} className="bg-gray-100">
                                    <td className="px-4 py-2">{procedure.names}</td>
                                    <td className="px-4 py-2">{procedure.lnames}</td>
                                    <td className="px-4 py-2">{procedure.requests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tarjeta 1: Expedir Licencia de tránsito */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <DocumentMagnifyingGlassIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Issue Traffic Licence</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Initiate application for the issuance of a traffic licence
                        </p>
                        <Link
                            href="/dashboard/procedures"
                            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-base font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:p-2 md:px-3"
                        >
                            <span>Traffic Licence</span> <ArrowRightIcon className="w-5 md:w-6" />
                        </Link>
                    </div>

                </div>

                {/* Tarjeta 2: Expedicción licencia de conducción */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center">
                            <DocumentDuplicateIcon className="w-15 md:w-20" />
                            <h2 className="text-xl font-bold ml-4">Issue a Driving Licence</h2>
                        </div>
                        <p className="mt-2 text-gray-600">
                            Initiate application for the issuance of a driver's licence
                        </p>
                    </div>
                    <Link
                        href="/dashboard/requests"
                        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-base font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:p-2 md:px-3"
                    >
                        <span>Driving Licence</span> <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
}