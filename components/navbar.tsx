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

            <nav className="flex flex-row w-screen h-fit text-white justify-between items-start border-b border-red-950 text-[4vh] py-5">
                <div className="hidden w-[60%] h-fit md:flex md:flex-row md:justify-between md:items-center mx-10 gap-2">
                    {/* Logo */}
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35}/>
                    </Link>

                    {/* Full Menu (hidden on small screens) */}
                    <Link href="/" className="flex hover:text-red-950">
                        Home
                    </Link>
                    <Link href="/about" className="flex hover:text-red-950">
                        About
                    </Link>
                    <Link href="/contact" className="flex hover:text-red-950">
                        Contact
                    </Link>
                </div>


                {/* Hamburger Menu (visible on small screens) */}
                <div className="md:hidden flex flex-col mx-10">
                    <button
                        onClick={toggleMenu}
                        className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        {isOpen ? (
                            <XMarkIcon className="block h-8 w-8" aria-hidden="true"/>
                        ) : (
                            <Bars3Icon className="block h-8 w-8" aria-hidden="true"/>
                        )}
                    </button>

                </div>

                {/* Dropdown Menu (visible when isOpen is true) */}
                {isOpen && (
                    <div ref={menuRef}
                         className="md:hidden flex flex-col my-2 items-start justify-center w-fit h-fit z-50  ">
                        <div className="flex w-full flex-col justify-center items-center my-4 gap-4  ">
                            <Link href="/"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                Home
                            </Link>
                            <Link href="/about"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                About
                            </Link>
                            <Link href="/contact"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                Contact
                            </Link>
                        </div>
                    </div>
                )}

                <div className=" w-fit text-[4vh] mx-10">
                    <UserDisplay/>
                </div>
            </nav>

        );

    } else {
        return (

            <nav className="flex flex-row w-screen h-fit text-white justify-between border-b border-red-950 text-[4vh]">
                <div
                    className="hidden w-[60%] h-16 md:flex md:flex-row md:justify-between md:items-center mx-10 my-2 gap-2">
                    {/* Logo */}
                    <Link href="/">
                        <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35}/>
                    </Link>

                    {/* Full Menu (hidden on small screens) */}
                    <a href="/" className="flex hover:text-red-950">
                        Home
                    </a>
                    <a href="/messages" className="flex hover:text-red-950">
                        Berichten
                    </a>
                    <a href="/discover" className="flex hover:text-red-950">
                        Ontdek
                    </a>
                    <a href="/settings" className="flex hover:text-red-950">
                        Settings
                    </a>
                </div>


                {/* Hamburger Menu (visible on small screens) */}
                <div className="md:hidden flex mx-10">
                    <button
                        onClick={toggleMenu}
                        className="inline-flex items-center justify-center rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                        {isOpen ? (
                            <XMarkIcon className="block h-8 w-8" aria-hidden="true"/>
                        ) : (
                            <Bars3Icon className="block h-8 w-8" aria-hidden="true"/>
                        )}
                    </button>

                </div>

                {/* Dropdown Menu (visible when isOpen is true) */}
                {isOpen && (
                    <div ref={menuRef}
                         className="md:hidden flex flex-col items-center justify-center w-screen h-fit absolute z-40  ">
                        <div className="flex flex-col justify-center items-center my-4 gap-4 ">
                            <a href="/"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                Home
                            </a>
                            <a href="/messages"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                Berichten
                            </a>
                            <a href="/contact"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                Contact
                            </a>
                            <a href="/settings"
                               className="text-red-950 text-center w-[80%] h-full hover:text-white  transition-all duration-300 text-xl">
                                Settings
                            </a>
                        </div>
                    </div>
                )}

                <div className="flex text-[4vh] mx-10 my-2 z-50">
                    <UserDisplay/>
                </div>
            </nav>

        );


    }
}
