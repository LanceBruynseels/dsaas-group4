"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import UserDisplay from "./UserDisplay";

export default function NavBar() {
    const path = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

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

    const commonLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    const authenticatedLinks = [
        { href: "/", label: "Home" },
        { href: "/messages", label: "Berichten" },
        { href: "/discover", label: "Ontdek" },
        { href: "/settings", label: "Settings" },
    ];

    const links = path === "/" || path === "/sign-in" || path === "/registration"
        ? commonLinks
        : authenticatedLinks;

    return (
        <nav className="flex flex-row w-screen h-fit text-white justify-between border-b border-red-950 text-[4vh] py-5">
            <div className="hidden w-[60%] h-fit md:flex md:flex-row md:justify-between md:items-center mx-10 gap-2">
                {/* Logo */}
                <Link href="/">
                    <Image src="/vlinder.webp" alt="Vlinder Logo" width={35} height={35} />
                </Link>

                {/* Full Menu */}
                {links.map((link) => (
                    <Link key={link.href} href={link.href} className="flex hover:text-red-950">
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Hamburger Menu */}
            <div className="md:hidden flex flex-col mx-10">
                <button
                    onClick={toggleMenu}
                    className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                    {isOpen ? (
                        <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                        <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    ref={menuRef}
                    className="md:hidden flex flex-col my-2 items-start justify-center w-fit h-fit z-50"
                >
                    <div className="flex w-full flex-col justify-center items-center my-4 gap-4">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-red-950 text-center w-[80%] h-full hover:text-white transition-all duration-300 text-xl"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-fit text-[4vh] mx-10">
                <UserDisplay />
            </div>
        </nav>
    );
}
