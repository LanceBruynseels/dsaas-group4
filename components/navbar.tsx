"use client";

import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import UserDisplay from "@components/UserDisplay";


export default function NavBar() {
    const path = usePathname();


    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null); // To refer to the menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);





    if (path === '/' || path === '/sign-in' || path === '/registration') {
        return (

            <nav className="flex flex-row w-screen h-fit text-white justify-between px-5 md:border-b border-red-950 text-[4vh]">
                <div className="hidden w-[40%] h-16 md:flex md:flex-row md:justify-between md:items-center">
                    {/* Logo */}
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35}/>
                    </Link>

                    {/* Full Menu (hidden on small screens) */}
                    <a href="/" className="flex hover:text-red-950">
                        Home
                    </a>
                    <a href="/about" className="flex hover:text-red-950">
                        About
                    </a>
                    <a href="/contact" className="flex hover:text-red-950">
                        Contact
                    </a>
                </div>


                {/* Hamburger Menu (visible on small screens) */}
                <div className="md:hidden flex">
                    <button
                        onClick={toggleMenu}
                        className="inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        {isOpen ? (
                            <XMarkIcon className="block h-8 w-8" aria-hidden="true"/>
                        ) : (
                            <Bars3Icon className="block h-8 w-8" aria-hidden="true"/>
                        )}
                    </button>

                </div>

                <div className="flex text-[4vh]">
                    <UserDisplay/>
                </div>

                {/* Dropdown Menu (visible when isOpen is true) */}
                {isOpen && (
                    <div ref={menuRef}
                         className="md:hidden flex flex-col items-center justify-center w-[30%] h-fit absolute z-40 y-16 x-16 bg-red-400 rounded-3xl">
                        <div className="flex flex-col justify-center items-center ">
                            <a href="/"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                Home
                            </a>
                            <a href="/about"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                About
                            </a>
                            <a href="/contact"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                Contact
                            </a>
                        </div>
                    </div>
                )}
            </nav>

        );

    } else {
        return (

            <nav className="flex flex-row w-screen h-fit text-white justify-between px-5 md:border-b border-red-950 text-[4vh]">
                <div className="hidden w-[40%] h-16 md:flex md:flex-row md:justify-between md:items-center">
                    {/* Logo */}
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35}/>
                    </Link>

                    {/* Full Menu (hidden on small screens) */}
                    <a href="/" className="flex hover:text-red-950">
                        Home
                    </a>
                    <a href="/about" className="flex hover:text-red-950">
                        About
                    </a>
                    <a href="/contact" className="flex hover:text-red-950">
                        Contact
                    </a>
                </div>


                {/* Hamburger Menu (visible on small screens) */}
                <div className="md:hidden flex">
                    <button
                        onClick={toggleMenu}
                        className="inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        {isOpen ? (
                            <XMarkIcon className="block h-8 w-8" aria-hidden="true"/>
                        ) : (
                            <Bars3Icon className="block h-8 w-8" aria-hidden="true"/>
                        )}
                    </button>

                </div>

                <div className="flex text-[4vh]">
                    <UserDisplay/>
                </div>

                {/* Dropdown Menu (visible when isOpen is true) */}
                {isOpen && (
                    <div ref={menuRef}
                         className="md:hidden flex flex-col items-center justify-center w-[30%] h-fit absolute z-40 y-16 x-16 bg-red-400 rounded-3xl">
                        <div className="flex flex-col justify-center items-center ">
                            <a href="/"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                Home
                            </a>
                            <a href="/berichten"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                About
                            </a>
                            <a href="/ontdek"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                Contact
                            </a>
                            <a href="/settings"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white hover:bg-red-950 transition-all duration-300 text-lg">
                                Contact
                            </a>
                        </div>
                    </div>
                )}
            </nav>

        );


    }
}
