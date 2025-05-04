'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import {
    ExclamationCircleIcon,
    TruckIcon,
    CodeBracketIcon,
    CheckBadgeIcon,
    RectangleStackIcon
} from '@/public/outline';
import { Button } from '@/app/ui/button';
import Cookies from 'js-cookie';

interface vState {
    stateId: number;
    statesName: string;
}

interface tService {
    tservicesId: number;
    tservicesName: string;
}

interface tVehicle {
    id: number;
    tvehicle: string;
}

interface Traffic {
    tlicensesId: number,
    plate: string,
    vstatesId: number,
    states: {
        stateId: number,
        statesName: string
    }
    tserviceId: number,
    services: {
        tservicesId: number,
        tservicesName: string
    }
    tvehicleId: number,
    vehicles: {
        id: number,
        tvehicle: string
    }
    procedures: {
        procedureId: number,
        requests: {
            peopleId: number
        }
    }
}

export default function TrafficPage() {
    const [plate, setPlate] = useState('');

    const [vState, setvState] = useState<vState[]>([]);
    const [selectedvState, setSelectedvState] = useState('');

    const [tService, settService] = useState<tService[]>([]);
    const [selectedtService, setSelectedtService] = useState('');

    const [tVehicle, settVehicle] = useState<tVehicle[]>([]);
    const [selectedtVehicle, setSelectedtVehicle] = useState('');

    const [traffic, settraffic] = useState<Traffic[]>([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedTraffic, setSelectedTraffic] = useState<Traffic | null>(null);

    const [plateUpdate, setPlateUpdate] = useState('');

    const [selectedvStateUpdate, setSelectedvStateUpdate] = useState(Number);

    const [SelectedTrafficId, setSelectedTrafficId] = useState(Number);

    const [selectedtServiceUpdate, setSelectedtServiceUpdate] = useState(Number);

    const [selectedtVehicleUpdate, setSelectedtVehicleUpdate] = useState(Number);

    const [SelectedProcedureIdUpdate, setSelectedProcedureIdUpdate] = useState(Number);

    const PeopleId = Number(Cookies.get('TypeId'));

    const handlePut = (traffics: Traffic) => {
        setErrorMessage('');
        setSelectedTraffic(traffics);
        setIsModalOpen(true);
    };

    async function fetchvState() {
        const response = await fetch('https://www.simytsoacha.somee.com/api/State');
        if (response.ok) {
            const data = await response.json();
            setvState(data);
        }
    };

    async function fetchtService() {
        const response = await fetch('https://www.simytsoacha.somee.com/api/Tservice');
        if (response.ok) {
            const data = await response.json();
            settService(data);
        }
    };

    async function fetchtVehicle() {
        const response = await fetch('https://www.simytsoacha.somee.com/api/Tvehicles');
        if (response.ok) {
            const data = await response.json();
            settVehicle(data);
        }
    };

    async function fetchTraffic() {
        const traffic = await fetch('https://www.simytsoacha.somee.com/api/Traffic');
        if (traffic.ok) {
            const data = await traffic.json();
            settraffic(data);
        }
    }; 

    useEffect(() => {

        if (selectedTraffic) {
            setSelectedTrafficId(selectedTraffic.tlicensesId);
            setPlateUpdate(selectedTraffic.plate);
            setSelectedvStateUpdate(selectedTraffic.states.stateId);
            setSelectedtServiceUpdate(selectedTraffic.services.tservicesId);
            setSelectedtVehicleUpdate(selectedTraffic.vehicles.id);
            setSelectedProcedureIdUpdate(selectedTraffic.procedures.procedureId);
        }

        fetchvState();
        fetchtService();
        fetchtVehicle();
        fetchTraffic();
    },
        [selectedTraffic]);

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

                        if (existingProcedure.length === 0) {
                            const dataProcedure = {
                                description: "Solicitud expedición licencia de tránsito",
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
                            } else {
                                console.error('Error al crear el procedimiento');
                            }
                        } else {
                            console.log('El procedimiento ya existe para esta solicitud');
                        }
                    } else {
                        console.error('Error al verificar el procedimiento existente');
                    }

                    const getProcedure = await fetch('https://www.simytsoacha.somee.com/api/Procedure', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (getProcedure.ok) {
                        const rProcedure = await getProcedure.json();

                        const lastProcedureId = Number(rProcedure[rProcedure.length - 1].procedureId);

                        const dataTraffic = {
                            plate: plate,
                            vstatesId: selectedvState,
                            tserviceId: selectedtService,
                            tvehicleId: selectedtVehicle,
                            procedureId: lastProcedureId,
                            isdeleted: false
                        };

                        const itraffic = await fetch('https://www.simytsoacha.somee.com/api/Traffic', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(dataTraffic),
                        });

                        if (!itraffic.ok) {
                            console.log("Error al crear el traffic");
                        } else {

                            alert("¡Registration sent successfully, we will contact you soon so that you can pay!");

                            const gettraffic = await fetch('https://www.simytsoacha.somee.com/api/Traffic');

                            const newTraffic = await gettraffic.json();

                            settraffic((newTraffic)); 
                        }
                    } else {
                        setErrorMessage("Error en la consulta de los procedures");
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

            if (!selectedTraffic) return;

            console.log(id);

            const trafficUpdate = {
                plate: plateUpdate,
                vstatesId: selectedvStateUpdate,
                tserviceId: selectedtServiceUpdate,
                tvehicleId: selectedtVehicleUpdate,
                procedureId: SelectedProcedureIdUpdate,
                isdeleted: false
            }

            console.log(trafficUpdate.procedureId);

            const response = await fetch(`https://www.simytsoacha.somee.com/api/Traffic/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trafficUpdate),
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
                await fetchTraffic();
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

            const response = await fetch(`https://www.simytsoacha.somee.com/api/Traffic/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                console.log('Traffic data deleted successfully');
                alert('Traffic data deleted successfully');
                await fetchTraffic();
            } else if (response.status === 404) {
                console.error('Traffic data not found');
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
                        In the following table you will see the information, related to your applications for the issuance of a traffic licence..
                    </p>
                </div>
            </div>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-center">Management of traffic licence applications</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Plate</th>
                                <th className="px-4 py-2">Vehicle Status</th>
                                <th className="px-4 py-2">Type of vehicle service</th>
                                <th className="px-4 py-2">Vehicle type</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {traffic.map((traffics: Traffic) => (
                                traffics.procedures.requests.peopleId === PeopleId ? (
                                    <tr key={traffics.tlicensesId} className="bg-gray-100">
                                        <td className="px-4 py-2">{traffics.plate}</td>
                                        <td className="px-4 py-2">{traffics.states.statesName}</td>
                                        <td className="px-4 py-2">{traffics.services.tservicesName}</td>
                                        <td className="px-4 py-2">{traffics.vehicles.tvehicle}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handlePut(traffics)}
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
                                                            handleDelete(e, traffics.tlicensesId);
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
                    <h1 className="text-4xl font-bold">Issuing of a traffic licence</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Please fill in the following form to start the process of issuing your
                        traffic licence.
                    </p>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex-1 rounded-lg bg-gray-50 p-4">
                    <h1 className={`${lusitana.className} mb-3 text-2xl text-center`}>Please fill
                        in the following form.</h1>
                    <div >
                        <label htmlFor="plate" className="block text-base font-medium text-gray-900">
                            Plate
                        </label>
                        <div className='relative'>
                            <input
                                type="text"
                                id="plate"
                                placeholder="Enter your vehicle number plate"
                                required
                                minLength={6}
                                maxLength={6}
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                                className="peer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                            />
                            <RectangleStackIcon className="pointer-events-none absolute 
                    left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="vState" className="block text-base font-medium text-gray-900">
                            State of the vehicle
                        </label>
                        <div className='relative'>
                            <select
                                name="vState"
                                id="vState"
                                className="mpeer block w-full rounded-md
                                border border-gray-200 py-[9px] pl-10 text-base outline-2 
                                placeholder:text-gray-500"
                                value={selectedvState}
                                onChange={(e) => setSelectedvState(e.target.value)}
                            >
                                <option value="">Select a type</option>
                                {vState.map((state) => (
                                    <option key={state.stateId} value={state.stateId}>
                                        {state.statesName}
                                    </option>
                                ))}
                            </select>
                            <CheckBadgeIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="tService" className="block text-base font-medium text-gray-900">
                            Type Service
                        </label>
                        <div className='relative'>
                            <select
                                id="tService"
                                value={selectedtService}
                                onChange={(e) => setSelectedtService(e.target.value)}
                                className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                <option value="">Select the type of service for your vehicle</option>
                                {tService.map((service) => (
                                    <option key={service.tservicesId} value={service.tservicesId}>
                                        {service.tservicesName}
                                    </option>
                                ))}
                            </select>
                            <CodeBracketIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="tVehicle" className="block text-base font-medium text-gray-900">
                            Type Vehicle
                        </label>
                        <div className='relative'>
                            <select
                                id="tVehicle"
                                value={selectedtVehicle}
                                onChange={(e) => setSelectedtVehicle(e.target.value)}
                                className="mpeer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                <option value="">Select vehicle type</option>
                                {tVehicle.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.tvehicle}
                                    </option>
                                ))}
                            </select>
                            <TruckIcon className="pointer-events-none absolute 
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
                        <Button type='submit'>Applying for a traffic licence</Button>
                    </div>
                </div>
            </form>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Update Data Traffic</h2>
                        <form onSubmit={(e) => handleUpdate(e, SelectedTrafficId)}>
                            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                                <h1 className={`${lusitana.className} mb-3 text-2xl text-center`}>Please fill
                                    in the following form.</h1>
                                <div >
                                    <label htmlFor="plate" className="block text-base font-medium text-gray-900">
                                        Plate
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            id="plate"
                                            placeholder="Enter your vehicle number plate"
                                            required
                                            minLength={6}
                                            maxLength={6}
                                            value={plateUpdate}
                                            onChange={(e) => setPlateUpdate(e.target.value)}
                                            className="peer block w-full rounded-md border border-gray-200 
                            py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500"
                                        />
                                        <RectangleStackIcon className="pointer-events-none absolute 
                    left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="vState" className="block text-base font-medium text-gray-900">
                                        State of the vehicle
                                    </label>
                                    <div className='relative'>
                                        <select
                                            name="vState"
                                            id="vState"
                                            className="mpeer block w-full rounded-md
                                                border border-gray-200 py-[9px] pl-10 text-base outline-2 
                                                placeholder:text-gray-500"
                                            value={selectedvStateUpdate}
                                            onChange={(e) => setSelectedvStateUpdate(Number(e.target.value))}
                                        >
                                            <option value="">Select a type</option>
                                            {vState.map((state) => (
                                                <option key={state.stateId} value={state.stateId}>
                                                    {state.statesName}
                                                </option>
                                            ))}
                                        </select>
                                        <CheckBadgeIcon className="pointer-events-none absolute 
                        left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="tService" className="block text-base font-medium text-gray-900">
                                        Type Service
                                    </label>
                                    <div className='relative'>
                                        <select
                                            id="tService"
                                            value={selectedtServiceUpdate}
                                            onChange={(e) => setSelectedtServiceUpdate(Number(e.target.value))}
                                            className="mpeer block w-full rounded-md border border-gray-200 
                                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                            <option value="">Select the type of service for your vehicle</option>
                                            {tService.map((service) => (
                                                <option key={service.tservicesId} value={service.tservicesId}>
                                                    {service.tservicesName}
                                                </option>
                                            ))}
                                        </select>
                                        <CodeBracketIcon className="pointer-events-none absolute 
                                            left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="tVehicle" className="block text-base font-medium text-gray-900">
                                        Type Vehicle
                                    </label>
                                    <div className='relative'>
                                        <select
                                            id="tVehicle"
                                            value={selectedtVehicleUpdate}
                                            onChange={(e) => setSelectedtVehicleUpdate(Number(e.target.value))}
                                            className="mpeer block w-full rounded-md border border-gray-200 
                                                py-[9px] pl-10 text-base outline-2 placeholder:text-gray-500">
                                            <option value="">Select vehicle type</option>
                                            {tVehicle.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.tvehicle}
                                                </option>
                                            ))}
                                        </select>
                                        <TruckIcon className="pointer-events-none absolute 
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