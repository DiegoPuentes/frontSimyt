"use client"
import { DateTime } from "next-auth/providers/kakao";
import { useEffect, useState } from "react";

export default function dash() {
    interface Driver {
        id: number,
        nlicense: string,
        ecenterId: number,
        ecenters: {
            ecenter: string
        }
        dateIssue: DateTime,
        stateId: number,
        states: {
            statesName: string
        }
        restrictions: {
            restrictionName: string
        }
        procedures: {
            description: string,
            states: {
                statesName: string
            }
            requests: {
                people: {
                    names: string,
                }
            }
        }
    }

    interface Traffic{
        tlicensesId: number,
        plate: string,
        states:{
            statesName: string
        }
        services:{
            tservicesName: string
        }
        vehicles:{
            tvehicle:string
        }
        procedures:{
            description:string,
            states:{
                statesName: string
            }
            requests:{
                people:{
                    names: string
                }
            }
        }
    }

    interface People{
        peopleId: number,
        names: string,
        lnames: string,
        documentType:{
            dtype: string
        }
        ndocument: string,
        sex:{
            preferredSex: string
        }
        dateBirth: DateTime,
        userType:{
            utypesName: string
        }
        userName: string,
        passcodes: string
    }

    const [driver, setDriver] = useState<Driver[]>([]);
    const [Traffic, setTraffic] = useState<Traffic[]>([]);
    const [People, setPeople] = useState<People[]>([]);

    async function fetchDriver() {
        const driver = await fetch("https://www.simytsoacha.somee.com/api/Driver");

        if (driver.ok) {
            const data = await driver.json();
            setDriver(data);
        }
    }

    async function fetchTraffic() {
        const Traffic = await fetch("https://www.simytsoacha.somee.com/api/Traffic");

        if (Traffic.ok) {
            const data = await Traffic.json();
            setTraffic(data);
        }
    }

    async function fetchPeople() {
        const people = await fetch("https://www.simytsoacha.somee.com/api/People");

        if (people.ok) {
            const data = await people.json();
            setPeople(data);
        }
    }

    useEffect(() => {
        fetchDriver();
        fetchTraffic();
        fetchPeople();
    }, []);

    return (
        <>
            <div className="p-6 bg-gray-50">
                {/* Encabezado Dashboard*/}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center 
                items-center text-center">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Here you will be able to check the information of all users.
                    </p>
                </div>
            </div>
            {/* Tabla Drive*/}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-center">Management of Driving Licence Applications</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Licence number</th>
                                <th className="px-4 py-2">CEA Expedition Licence</th>
                                <th className="px-4 py-2">Date of Issue</th>
                                <th className="px-4 py-2">State</th>
                                <th className="px-4 py-2">Restriction</th>
                                <th className="px-4 py-2">Procedure Description</th>
                                <th className="px-4 py-2">Names of the owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driver.map((drivers: Driver) => (
                                <tr key={drivers.id} className="bg-gray-100 border-b">
                                    <td className="px-4 py-2 text-center">{drivers.nlicense}</td>
                                    <td className="px-4 py-2 text-center">{drivers.ecenters.ecenter}</td>
                                    <td className="px-4 py-2 text-center">{drivers.dateIssue}</td>
                                    <td className="px-4 py-2 text-center">{drivers.states.statesName}</td>
                                    <td className="px-4 py-2 text-center">{drivers.restrictions.restrictionName}</td>
                                    <td className="px-4 py-2 text-center">{drivers.procedures.description}</td>
                                    <td className="px-4 py-2 text-center">{drivers.procedures.requests.people.names}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Tabla Traffic*/}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-center">Management of Traffic Licence Applications</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Plate</th>
                                <th className="px-4 py-2">State</th>
                                <th className="px-4 py-2">Type Service</th>
                                <th className="px-4 py-2">Type vehicle</th>
                                <th className="px-4 py-2">Procedure Description</th>
                                <th className="px-4 py-2">Names of the owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Traffic.map((traffics: Traffic) => (
                                <tr key={traffics.tlicensesId} className="bg-gray-100 border-b">
                                    <td className="px-4 py-2 text-center">{traffics.plate}</td>
                                    <td className="px-4 py-2 text-center">{traffics.states.statesName}</td>
                                    <td className="px-4 py-2 text-center">{traffics.services.tservicesName}</td>
                                    <td className="px-4 py-2 text-center">{traffics.vehicles.tvehicle}</td>
                                    <td className="px-4 py-2 text-center">{traffics.procedures.description}</td>
                                    {/*<td className="px-4 py-2 text-center">{traffics.procedures.requests.people.names}</td>*/}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Tabla People*/}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-center">People management</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Names</th>
                                <th className="px-4 py-2">Last Names</th>
                                <th className="px-4 py-2">Document Type</th>
                                <th className="px-4 py-2">Document number</th>
                                <th className="px-4 py-2">Sex</th>
                                <th className="px-4 py-2">Date of Birthday</th>
                                <th className="px-4 py-2">User Type</th>
                                <th className="px-4 py-2">Username</th>
                                <th className="px-4 py-2">Password Encrypt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {People.map((person: People) => (
                                <tr key={person.peopleId} className="bg-gray-100 border-b">
                                    <td className="px-4 py-2 text-center">{person.names}</td>
                                    <td className="px-4 py-2 text-center">{person.lnames}</td>
                                    <td className="px-4 py-2 text-center">{person.documentType.dtype}</td>
                                    <td className="px-4 py-2 text-center">{person.ndocument}</td>
                                    <td className="px-4 py-2 text-center">{person.sex.preferredSex}</td>
                                    <td className="px-4 py-2 text-center">{person.dateBirth}</td>
                                    <td className="px-4 py-2 text-center">{person.userType.utypesName}</td>
                                    <td className="px-4 py-2 text-center">{person.userName}</td>
                                    <td className="px-4 py-2 text-center">{person.passcodes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}