'use client'

import React, { useContext, createContext, useState } from "react"
import Image from "next/image";
import NotificationItem, {Notification_user} from "@components/notification";
import {ChevronFirst, ChevronLast} from "lucide-react";

interface NotificationProps{
    notifications_data: any;
}

export default function Sidebar({notifications_data} : NotificationProps) {
    const [expanded, setExpanded] = useState(true)

    return (
        <div className={`flex flex-row align-middle basis-1/2`}>
            <div
                className={`flex shadow-md flex-col rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] transition-all 
                ${
                    expanded ? "w-full m-4 p-4" : "w-10 m-4 cursor-pointer"
                }`}
                onClick={() => setExpanded((curr) => curr === false ? true : curr)}>

                <div className={`flex flex-row justify-between items-center ${
                    expanded ? "p-4" : "px-1 py-4"
                }`}>
                    <h2 className={`text-xl font-bold overflow-hidden  ${
                        expanded ? "w-32" : "w-0"
                    }`}>Meldingen</h2>
                    <div>
                        <Image src="/bell.png" alt="Bell Icon" height={25} width={25}/>
                    </div>

                </div>
                <div
                    className="flex flex-col my-2 h-full overflow-y-auto
                    scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-red-950 scrollbar-track-red-50 h-32">

                    {/* Render Notifications */}
                    {notifications_data.data && notifications_data.data.length > 0 ? (
                        notifications_data.data.map((notification: Notification_user) => (
                            <NotificationItem key={notification.notification_id} notification={notification}
                                              expanded={expanded}/>
                        ))
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center w-full h-full ">
                            <div className="flex flex-col items-center p-8">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-16 h-16 text-red-800 mb-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 17h5l-1.405 2.81A2.25 2.25 0 0116.5 21h-9a2.25 2.25 0 01-2.095-1.19L4 17h5m6 0V8.25a3 3 0 10-6 0V17m6 0H9"
                                    />
                                </svg>
                                <h2 className="text-2xl font-semibold text-red-800 mb-2">
                                    No Notifications
                                </h2>
                                <p className="text-red-700 text-center">
                                    Start using the application to get your first notification!
                                </p>
                            </div>
                        </div>

                    )}
                </div>
            </div>
            <div  className={`flex flex-row items-center ${
                expanded ? "" : "w-full"
            }`}>
            <button
                onClick={() => setExpanded((curr) => !curr)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
                {expanded ? <ChevronFirst/> : <ChevronLast/>}
            </button>
            </div>
        </div>
)
}