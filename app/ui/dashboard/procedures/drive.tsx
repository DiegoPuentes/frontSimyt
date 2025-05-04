'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import {
    ExclamationCircleIcon,
    TruckIcon,
    CheckBadgeIcon,
    RectangleStackIcon,
    CalendarIcon,
    NoSymbolIcon
} from '@/public/outline';
import { Button } from '@/app/ui/button';
import Cookies from 'js-cookie';
import { DateTime } from 'next-auth/providers/kakao';

interface eCenter {
    ecenterId: number;
    ecenter: string;
}

interface vState {
    stateId: number;
    statesName: string;
}

interface Restriction {
    restrictionId: number;
    restrictionName: string;
}

interface People {
    peopleId: number,
    ndocument: string
}

interface Driver {
    id: number,
    nlicense: number,
    ecenterId: number,
    ecenters: {
        ecenterId: number,
        ecenter: string
    }
    dateIssue: DateTime,
    stateId: number,
    states: {
        stateId: number,
        statesName: string
    }
    restrictionId: number,
    restrictions: {
        restrictionId: number,
        restrictionName: string
    }
    procedureId: number,
    procedures: {
        procedureId: number,
        description: string
        requests: {
            people: {
                peopleId: number,
                ndocument: string,
            }
        }
    }
}

interface Procedure {
    procedureId: number,
    description: string,
    stateId: number,
    states: {
        statesName: string
    }
    requestId: number,
    requests: {
        people: {
            peopleId: number
        }
    }
    isdeleted: boolean,
}

export default function DrivePage() {
    const [nLicense, setnLicense] = useState('');

    const [eCenter, seteCenter] = useState<eCenter[]>([]);
    const [selectedCenter, setSelectedCenter] = useState('');

    const [dateIssue, setdateIssue] = useState('');

    const [dState, setdState] = useState<vState[]>([]);
    const [selectedState, setSelectedState] = useState('');

    const [restriction, setRestriction] = useState<Restriction[]>([]);
    const [selectedRestriction, setSelectedRestriction] = useState('');

    const [driver, setDriver] = useState<Driver[]>([]);

    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const PeopleId = Number(Cookies.get('TypeId'));

    //Propiedades para modificar y cargar la data en el modal

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [selectedNlicense, setSelectedNlicense] = useState(Number);
    const [selectedDriverId, setSelectedDriverId] = useState(Number);
    const [selectedEcenterUpdate, setSelectedEcenterUpdate] = useState(Number);
    const [SelectedDateUpdate, setSelectedDateUpdate] = useState("");
    const [selecteddStateUpdate, setSelecteddStateUpdate] = useState(Number);
    const [selectedtRestrictionUpdate, setSelectedtRestrictionUpdate] = useState(Number);
    const [selectedtProcedureUpdate, setSelectedtProcedurenUpdate] = useState(Number);

    const handlePut = (drivers: Driver) => {
        setErrorMessage('');
        setSelectedDriver(drivers);
        setIsModalOpen(true);
    };

    async function fetchPeople() {
        try {
            const response = await fetch('https://www.simytsoacha.somee.com/api/People');

            if (response.ok) {
                const data = await response.json();

                const person = data.find((item: People) => item.peopleId === PeopleId);

                if (person) {
                    const specific = person.ndocument;
                    setnLicense(specific);
                } else {
                    setErrorMessage("First log in to continue.");
                }
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            setErrorMessage("Ocurrió un error al obtener los datos.");
        }
    };

    async function fetchCenter() {
        const response = await fetch('https://www.simytsoacha.somee.com/api/Center');
        if (response.ok) {
            const data = await response.json();
            seteCenter(data);
        }
    };

    async function fetchtState() {
        const response = await fetch('https://www.simytsoacha.somee.com/api/State');
        if (response.ok) {
            const data = await response.json();
            setdState(data);
        }
    };

    async function fetchtRestriction() {
        const response = await fetch('https://www.simytsoacha.somee.com/api/Restriction');
        if (response.ok) {
            const data = await response.json();
            setRestriction(data);
        }
    };

    async function fetchDrive() {
        const traffic = await fetch('https://www.simytsoacha.somee.com/api/Driver');
        if (traffic.ok) {
            const data = await traffic.json();
            setDriver(data);
        }
    };

    useEffect(() => {

        if (selectedDriver) {
            console.log(selectedDriver);
            setSelectedDriverId(selectedDriver.id);
            setSelectedNlicense(selectedDriver.nlicense);
            setSelectedEcenterUpdate(selectedDriver.ecenters.ecenterId);
            setSelectedDateUpdate(new Date(selectedDriver.dateIssue).toISOString().split('T')[0]);
            setSelecteddStateUpdate(selectedDriver.states.stateId);
            setSelectedtRestrictionUpdate(selectedDriver.restrictions.restrictionId);
            setSelectedtProcedurenUpdate(selectedDriver.procedureId);
        };

        fetchCenter();
        fetchtState();
        fetchtRestriction();
        fetchDrive();
        fetchPeople();
    },
        [selectedDriver]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const token = Cookies.get("TypeId");

            const dataRequest = {
                peopleId: token,
                requestDate: new Date().toISOString(),
                //Se modifica el officerId, ya que el administrador es el id = 2
                officerId: 2,
                isdeleted: false
            };

            const requests = await fetch('https://www.simytsoacha.somee.com/api/Request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRequest),
            });

            if (requests.ok) {
                const getRequest = await fetch('https://www.simytsoacha.somee.com/api/Request', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (getRequest.ok) {
                    const data = await getRequest.json();
                    const lastRequestId = Number(data[data.length - 1].requestId);

                    const existingProcedureCheck = await fetch(`https://www.simytsoacha.somee.com/api/Procedure?requestId=${lastRequestId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (existingProcedureCheck.ok) {
                        const existingProcedure = await existingProcedureCheck.json();

                        if (!existingProcedure.some((procedure: Procedure) => procedure.description === "Solicitud expedición licencia de conducción")) {
                            const dataProcedure = {
                                description: "Solicitud expedición licencia de conducción",
                                stateId: 1,
                                requestId: lastRequestId,
                                isdeleted: false
                            };

                            const procedure = await fetch('https://www.simytsoacha.somee.com/api/Procedure', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(dataProcedure),
                            });

                            if (procedure.ok) {
                                console.log('Procedimiento creado exitosamente');

                                const getProcedure = await fetch('https://www.simytsoacha.somee.com/api/Procedure', {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (getProcedure.ok) {
                                    const rProcedure = await getProcedure.json();
                                    const lastProcedureId = Number(rProcedure[rProcedure.length - 1].procedureId);

                                    const dataDriver = {
                                        nlicense: nLicense,
                                        ecenterId: selectedCenter,
                                        dateIssue: new Date(dateIssue).toISOString(),
                                        stateId: selectedState,
                                        restrictionId: selectedRestriction,
                                        procedureId: lastProcedureId,
                                        isdeleted: false
                                    };

                                    const iDriver = await fetch('https://simytsoacha.somee.com/api/Driver', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(dataDriver),
                                    });

                                    if (!iDriver.ok) {
                                        const errorText = await iDriver.text();
                                        console.error("Error al crear el driver:", errorText);
                                    } else {
                                        alert("¡Registration sent successfully, we will contact you soon so that you can pay!");
                                        await fetchDrive();
                                    }
                                } else {
                                    setErrorMessage("Error en la consulta de los procedures");
                                }
                            } else {
                                console.error('Error al crear el procedimiento');
                            }
                        } else {
                            setErrorMessage("You have already started a procedure, so you must modify or delete it to continue.");
                        }
                    } else {
                        console.error('Error al verificar el procedimiento existente');
                    }
                } else {
                    setErrorMessage('Error al obtener los datos:');
                }
            } else {
                setErrorMessage('Error al crear la solicitud');
            }
        } catch (error) {
            setErrorMessage('Error connecting to server: ' + error);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        setErrorMessage('');

        try {

            if (!selectedDriver) return;

            const DriverUpdate = {
                nLicense: selectedNlicense,
                ecenterId: selectedEcenterUpdate,
                dateIssue: SelectedDateUpdate,
                stateId: selecteddStateUpdate,
                restrictionId: selectedtRestrictionUpdate,
                procedureId: selectedtProcedureUpdate,
                isdeleted: false
            }

            const response = await fetch(`https://www.simytsoacha.somee.com/api/Driver/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(DriverUpdate),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    console.error('Bad request');
                    setErrorMessage('There was an error with the request.');
                } else if (response.status === 404) {
                    console.error('Traffic data not found');
                    setErrorMessage('Traffic data not found.');
                } else {
                    console.error('Unexpected error');
                    setErrorMessage('An unexpected error occurred.');
                }
            } else {
                await fetchDrive();
                alert("Traffic data updated successfully");
                setIsModalOpen(false);
                console.log('Traffic data updated successfully');
            }
        } catch (error) {
            console.error('Error updating traffic data:', error);
            setErrorMessage('Error updating traffic data');
        }
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault();
        setErrorMessage('');

        console.log(id);

        try {

            const response = await fetch(`https://www.simytsoacha.somee.com/api/Driver/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                console.log('Driver data deleted successfully');
                alert('Driver data deleted successfully');
                await fetchDrive();

                const response = await fetch('https://www.simytsoacha.somee.com/api/Procedure', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const procedures = await response.json();

                    const existingProcedure = procedures.find((procedure: Procedure) =>
                        procedure.description === "Solicitud expedición licencia de conducción" &&
                        procedure.requests.people.peopleId === PeopleId
                    );

                    if (existingProcedure) {
                        const id = existingProcedure.procedureId;

                        const deleteProcedure = await fetch(`https://www.simytsoacha.somee.com/api/Procedure/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (deleteProcedure.ok) {
                            console.log("Procedure eliminado correctamente");
                        } else {
                            console.error("Error al eliminar el procedure");
                        }
                    } else {
                        console.log("No se encontró ningún procedimiento que coincida con los criterios");
                    }
                } else {
                    console.error("Error al obtener los procedimientos");
                }
            } else if (response.status === 404) {
                console.error('Driver data not found');
            } else {
                console.error('Unexpected error');
            }
        } catch (error) {
            console.error('Error deleting traffic data:', error);
        }
    }

    return (
        <>
            <div className="p-6 bg-gray-50">
                {/* Encabezado Tabla*/}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center 
                items-center text-center">
                    <h1 className="text-4xl font-bold">Information on recent applications</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        In the following table you will see the information,
                        related to your applications for the issuance of driving licences..
                    </p>
                </div>
            </div>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-center">Management of driving licence applications</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Licence number</th>
                                <th className="px-4 py-2">CEA Expedition licence</th>
                                <th className="px-4 py-2">Date of issue</th>
                                <th className="px-4 py-2">State</th>
                                <th className="px-4 py-2">Restriction</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driver.map((drivers: Driver) => (
                                drivers.procedures.requests.people.peopleId === PeopleId ? (
                                    <tr key={drivers.id} className="bg-gray-100">
                                        <td className="px-4 py-2">{drivers.nlicense}</td>
                                        <td className="px-4 py-2">{drivers.ecenters.ecenter}</td>
                                        <td className="px-4 py-2">{drivers.dateIssue}</td>
                                        <td className="px-4 py-2">{drivers.states.statesName}</td>
                                        <td className="px-4 py-2">{drivers.restrictions.restrictionName}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handlePut(drivers)}
                                                    className="flex h-10 items-center rounded-lg bg-blue-500 
                                                                px-4 text-sm font-medium text-white transition-colors 
                                                                hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 
                                                                focus-visible:outline-offset-2 focus-visible:outline-blue-500 
                                                                active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                                                >
                                                    Modify
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        if (window.confirm("Are you sure you want to remove this element?")) {
                                                            handleDelete(e, drivers.id);
                                                        }
                                                    }}
                                                    className="flex h-10 items-center rounded-lg bg-blue-500 
                                                                px-4 text-sm font-medium text-white transition-colors 
                                                                hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 
                                                                focus-visible:outline-offset-2 focus-visible:outline-blue-500 
                                                                active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-6 bg-gray-50">
                {/* Encabezado */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center 
                items-center text-center">
                    <h1 className="text-4xl font-bold">Issue of driving licences</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Fill in the form below to start the process of issuing your driving licence.
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex-1 rounded-lg bg-gray-50 p-4">
                    <h1 className={`${lusitana.className} mb-3 text-2xl text-center`}>Please fill
                        in the following form.</h1>
                    <div >
                        <label htmlFor="nLicense" className="block text-base font-medium text-gray-900">
                            Licence number
                        </label>
                        <div className='relative'>
                            <input
                                type="text"
                                id="nLicense"
                                disabled
                                value={nLicense}
                                className="peer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                            />
                            <RectangleStackIcon className="pointer-events-none absolute 
                    left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="eCenter" className="block text-base font-medium text-gray-900">
                            CEA Expedition licence
                        </label>
                        <div className='relative'>
                            <select
                                name="eCenter"
                                id="eCenter"
                                className="mpeer block w-full rounded-md
                                border border-gray-200 py-[9px] pl-10 text-base outline-2 
                                placeholder:text-gray-500"
                                value={selectedCenter}
                                onChange={(e) => setSelectedCenter(e.target.value)}
                            >
                                <option value="">Select a type</option>
                                {eCenter.map((center) => (
                                    <option key={center.ecenterId} value={center.ecenterId}>
                                        {center.ecenter}
                                    </option>
                                ))}
                            </select>
                            <CheckBadgeIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="dateIssue" className="block text-base font-medium text-gray-900">
                            Date Issue
                        </label>
                        <div className='relative'>
                            <input
                                type='date'
                                id="dateIssue"
                                required
                                value={dateIssue}
                                onChange={(e) => setdateIssue(e.target.value)}
                                className="mpeer block w-full rounded-md border border-gray-200 
                                    py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                            </input>
                            <CalendarIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="dState" className="block text-base font-medium text-gray-900">
                            State driving licence
                        </label>
                        <div className='relative'>
                            <select
                                id="dState"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="mpeer block w-full rounded-md border border-gray-200 
                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                <option value="">Select State driving licence</option>
                                {dState.map((state) => (
                                    <option key={state.stateId} value={state.stateId}>
                                        {state.statesName}
                                    </option>
                                ))}
                            </select>
                            <TruckIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="restriction" className="block text-base font-medium text-gray-900">
                            Restriction
                        </label>
                        <div className='relative'>
                            <select
                                id="restriction"
                                value={selectedRestriction}
                                onChange={(e) => setSelectedRestriction(e.target.value)}
                                className="mpeer block w-full rounded-md border border-gray-200 
                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                <option value="">Select the Restriction</option>
                                {restriction.map((res) => (
                                    <option key={res.restrictionId} value={res.restrictionId}>
                                        {res.restrictionName}
                                    </option>
                                ))}
                            </select>
                            <NoSymbolIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    {errorMessage && (
                        <>
                            <div className="flex items-center text-red-500">
                                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                <p className="text-base">{errorMessage}</p>
                            </div>
                        </>
                    )}
                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            href="/dashboard/procedures"
                            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </Link>
                        <Button type='submit'>Applying for a driver licence</Button>
                    </div>
                </div>
            </form>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Update Data Driver</h2>
                        <form onSubmit={(e) => handleUpdate(e, selectedDriverId)}>
                            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                                <h1 className={`${lusitana.className} mb-3 text-2xl text-center`}>Modify the information you want to change.</h1>
                                <div>
                                    <label htmlFor="eCenter" className="block text-base font-medium text-gray-900">
                                        CEA Expedition licence
                                    </label>
                                    <div className='relative'>
                                        <select
                                            name="eCenter"
                                            id="eCenter"
                                            className="mpeer block w-full rounded-md
                                                border border-gray-200 py-[9px] pl-10 text-base outline-2 
                                                placeholder:text-gray-500"
                                            value={selectedEcenterUpdate}
                                            onChange={(e) => setSelectedEcenterUpdate(Number(e.target.value))}
                                        >
                                            <option value="">Select a type</option>
                                            {eCenter.map((center) => (
                                                <option key={center.ecenterId} value={center.ecenterId}>
                                                    {center.ecenter}
                                                </option>
                                            ))}
                                        </select>
                                        <CheckBadgeIcon className="pointer-events-none absolute 
                                            left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dateIssue" className="block text-base font-medium text-gray-900">
                                        Date Issue
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type='date'
                                            id="dateIssue"
                                            required
                                            value={SelectedDateUpdate}
                                            onChange={(e) => setSelectedDateUpdate(e.target.value)}
                                            className="mpeer block w-full rounded-md border border-gray-200 
                                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                        </input>
                                        <CalendarIcon className="pointer-events-none absolute 
                                            left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dState" className="block text-base font-medium text-gray-900">
                                        State driving licence
                                    </label>
                                    <div className='relative'>
                                        <select
                                            id="dState"
                                            value={selecteddStateUpdate}
                                            onChange={(e) => setSelecteddStateUpdate(Number(e.target.value))}
                                            className="mpeer block w-full rounded-md border border-gray-200 
                                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                            <option value="">Select State driving licence</option>
                                            {dState.map((state) => (
                                                <option key={state.stateId} value={state.stateId}>
                                                    {state.statesName}
                                                </option>
                                            ))}
                                        </select>
                                        <TruckIcon className="pointer-events-none absolute 
                                            left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="restriction" className="block text-base font-medium text-gray-900">
                                        Restriction
                                    </label>
                                    <div className='relative'>
                                        <select
                                            id="restriction"
                                            value={selectedtRestrictionUpdate}
                                            onChange={(e) => setSelectedtRestrictionUpdate(Number(e.target.value))}
                                            className="mpeer block w-full rounded-md border border-gray-200 
                                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                            <option value="">Select the Restriction</option>
                                            {restriction.map((res) => (
                                                <option key={res.restrictionId} value={res.restrictionId}>
                                                    {res.restrictionName}
                                                </option>
                                            ))}
                                        </select>
                                        <NoSymbolIcon className="pointer-events-none absolute 
                                            left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                {errorMessage && (
                                    <>
                                        <div className="flex items-center text-red-500">
                                            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                            <p className="text-base">{errorMessage}</p>
                                        </div>
                                    </>
                                )}
                                <div className="mt-6 flex justify-end gap-4">
                                    <Button type='submit'>Update</Button>
                                </div>
                            </div>
                        </form>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}