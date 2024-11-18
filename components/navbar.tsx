"use client";

import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
    const path = usePathname();

    if (path === '/' || path === '/sign-in' || path === '/sign-up') {
        return (
            <nav className="w-full h-16 flex justify-between items-center px-5">
                {/* Application Navigation Bar */}
                <div className="flex gap-10 items-center text-xs font-semibold text-gray-800">
                    <Link href="/">
                        <Image src="/vlinder.png" alt="Vlinder Logo" width={35} height={35} />
                    </Link>
                    <Link href="/" className="text-gray-700 hover:text-red-700">Home</Link>
                    <Link href="/about" className="text-gray-700 hover:text-red-700">About Us</Link>
                    <Link href="/contact" className="text-gray-700 hover:text-red-700">Contact</Link>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="w-full h-16 flex justify-between items-center px-5">
                {/* Navigation Bar */}
                <div className="flex gap-10 items-center text-xs font-semibold text-gray-800">
                    <Link href="/">
                        <Image src="/Vlinder.png" alt="Vlinder Logo" width={35} height={35} />
                    </Link>
                    <Link href="/" className="text-gray-700 hover:text-red-700">Start</Link>
                    <Link href="/berichten" className="text-gray-700 hover:text-red-700">Berichten</Link>
                    <Link href="/ontdek" className="text-gray-700 hover:text-red-700">Ontdek</Link>
                    <Link href="/settings" className="text-gray-700 hover:text-red-700">Instellingen</Link>
                </div>
            </nav>
        );
    }
}
