"use client";

import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
    const path = usePathname();

    if (path === '/' || path === '/sign-in' || path === '/registration' || path === '/caretaker') {
        return (
            <nav className="w-full h-16 flex justify-between items-center px-5">
                {/* Application Navigation Bar */}
                <div className="flex gap-10 items-center text-xs font-semibold text-gray-800">
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35}/>
                    </Link>
                    <Link href="/" className="hover:text-red-700"><h4>Home</h4></Link>
                    <Link href="/about" className="text-gray-700 hover:text-red-700">About Us</Link>
                    <Link href="/contact" className="text-gray-700 hover:text-red-700">Contact</Link>
                    <button className="rounded-xl hover:bg-[#771d1d] bg-[#FCA5A5] transition duration-300 p-2"><Link href="/caretaker" className="text-red-50 ">Caretaker</Link></button>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="w-full h-16 flex justify-between items-center px-5">
                {/* Navigation Bar */}
                <div className="flex gap-10 items-center text-xs font-semibold text-gray-800">
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35} />
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
