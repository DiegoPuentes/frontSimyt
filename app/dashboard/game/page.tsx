"use client";
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';

interface Lxm {
    levelId: number,
    levels: {
        name: string
    },
    matchId: number,
    matchs: {
        people: {
            peopleId: number,
            names: string,
        }
    }
    scored: number
}

export default function Game() {

    const [lxm, setLxm] = useState<Lxm[]>([]);
    const PeopleId = Number(Cookies.get('TypeId'));

    async function fetchLxm() {
        try {
            const lxm = await fetch('https://www.simytsoacha.somee.com/api/LxM', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (lxm.ok) {
                const data = await lxm.json();
                setLxm(data);
            } else {
                console.error("Failed to fetch: ", lxm.status, lxm.statusText);
            }
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    };

    useEffect(() => {
        fetchLxm();
    },
        []);

    return (
        <>
            <div className="p-6 bg-gray-50">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-center 
                    items-center text-center">
                    <h1 className="text-4xl font-bold">Drive Safe Game Information</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Here you will see the information related to the game,
                        where you can see your score and games played, so you can drive safely..
                    </p>
                </div>
            </div>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-6 text-center">Management of Game</h1>
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2">Level</th>
                                <th className="px-4 py-2">Names</th>
                                <th className="px-4 py-2">Scored</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lxm.map((data: Lxm) => (
                                data.matchs.people.peopleId === PeopleId ? (
                                    <tr key={data.levelId} className="bg-gray-100">
                                        <td className="px-4 py-2">{data.levels.name}</td>
                                        <td className="px-4 py-2">{data.matchs.people.names}</td>
                                        <td className="px-4 py-2">{data.scored}</td>
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-200 font-semibold">
                                <td className="px-4 py-2" colSpan={2}>Total Scored</td>
                                <td className="px-4 py-2">
                                    {
                                        lxm
                                            .filter((data: Lxm) => data.matchs.people.peopleId === PeopleId)
                                            .reduce((total, data) => total + data.scored, 0)
                                    }
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type='submit'>Download Game</button>
                </div>
            </div>
        </>
    );
}