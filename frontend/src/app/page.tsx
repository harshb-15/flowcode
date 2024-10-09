// import Image from "next/image";
'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function Home() {
    const [roomcode, setRoomCode] = useState<string>();
    return (
        <div>
            <h1>Welcome to FlowCode</h1>
            <Link href="/create-room" legacyBehavior>
                <a>
                    <button>Create Room</button>
                </a>
            </Link>

            <input
                type="text"
                placeholder="Enter room code..."
                value={roomcode}
                onChange={(e) => {
                    setRoomCode(e.target.value);
                }}
            />
            <Link href={'/room/' + roomcode} legacyBehavior>
                <a>
                    <button>Join Room</button>
                </a>
            </Link>
        </div>
    );
}
