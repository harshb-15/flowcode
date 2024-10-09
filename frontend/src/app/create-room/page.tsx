'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CreateRoomData = {
    containerId: string;
};

export default function CreateRoom() {
    const [data, setData] = useState<CreateRoomData>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const nextRouter = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/create-room');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result: CreateRoomData = await response.json();
            setData(result);
            setTimeout(() => {
                nextRouter.replace(`/room/${result.containerId}`);
            }, 3000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div>Creating a new Room...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Room Created!</h1>
            <p>You will be redirected shorlty...</p>
        </div>
    );
}
