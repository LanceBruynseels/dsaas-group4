"use client";

import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import "@/components/mediaQuery"
import {useIsMobile} from "@components/mediaQuery";
export default function NavBar() {
    const path = usePathname();
    const isMobile = useIsMobile();

    if (path === '/' || path === '/sign-in' || path === '/registration') {
        return (
            <nav className="w-full h-16 flex justify-between items-center px-5">
                {/* Application Navigation Bar */}
                <div className="flex gap-10 items-center text-xs font-semibold text-gray-800">
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35}/>
                    </Link>
                    <Link href="/" className="hover:text-red-700"><h4>Home</h4></Link>
                    <Link href="/about" className="text-gray-700 hover:text-red-700">About Us</Link>
                    <Link href="/contact-us" className="text-gray-700 hover:text-red-700">Contact</Link>
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
                    <Link href="/messaging" className="text-gray-700 hover:text-red-700">Berichten</Link>
                    <Link href="/ontdek" className="text-gray-700 hover:text-red-700">Ontdek</Link>
                    <Link href={`/settings?isMobile=${isMobile}`} className="text-gray-700 hover:text-red-700">Instellingen</Link>
                </div>
            </nav>
        );
    }
}