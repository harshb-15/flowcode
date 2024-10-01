// import Image from "next/image";
'use client';
import Link from 'next/link';

export default function Home() {
    return (
        <div>
            <h1>Welcome to FlowCode</h1>
            <Link href="/create-room" legacyBehavior>
                <a>
                    <button>Create Room</button>
                </a>
            </Link>

            <input type="text" />
            <button>Join Code Room</button>
        </div>
    );
}
