import Image from "next/image";
import React, {Suspense} from "react";
import {FlowbiteCarousel} from "@components/flowbiteCarousel";
import NotificationItem, {Notification_user} from "@components/notification";
import MatchingCard from "@components/matchingCard";
import FilterSection from "@components/filterselection";
import CustomSlider from "@components/customSlider";
import SliderSettings from "@components/settings/sliderSettings";
import ProfilePopup from "@components/profilePopUp";
import {ChevronFirst, ChevronLast} from "lucide-react";

export default function Loading() {
    return (
        <>
            <div className="flex flex-row w-full h-screen justify-center text-red-950">
                {/* Notifications Side Panel */}
                <div className="flex flex-row align-middle lg:basis-1/4">
                    <div
                        className="sm:hidden md:hidden lg:flex w-full shadow-md lg:flex-col rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                        <div className="flex flex-row p-4 justify-between items-center">
                            <h2 className="text-xl font-bold ">Meldingen</h2>
                            <div>
                                <Image src="/bell.png" alt="Bell Icon" height={25} width={25}/>
                            </div>
                        </div>
                        <div role="status"
                             className="max-w-sm p-4 rounded shadow animate-pulse md:p-6 ">
                            <div className="flex flex-row justify-between items-center">
                                <svg className="w-10 h-10 me-3 text-red-400 dark:text-red-700" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                </svg>
                                <div>
                                    <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-32 mb-2"></div>
                                    <div className="w-48 h-2 bg-red-400 rounded-full dark:bg-red-700"></div>
                                </div>
                            </div>
                        </div>

                        <div role="status"
                             className="max-w-sm p-4 rounded shadow animate-pulse md:p-6 ">
                            <div className="flex flex-row justify-between items-center">
                                <svg className="w-10 h-10 me-3 text-red-400 dark:text-red-700" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                </svg>
                                <div>
                                    <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-32 mb-2"></div>
                                    <div className="w-48 h-2 bg-red-400 rounded-full dark:bg-red-700"></div>
                                </div>
                            </div>
                        </div>
                        <span className="sr-only">Loading...</span>
                        <div className="flex flex-col my-2 h-full">

                        </div>
                    </div>
                    <div className={"flex flex-row items-center"}>
                        <ChevronFirst/>
                    </div>
                </div>

                {/* middle section with matching and liking*/}
                <div
                    className="flex flex-col basis-1/2 bg-gradient-to-b shadow-md from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg ">
                    <div className="text-center align-middle">
                        <div role="status">
                            <svg aria-hidden="true"
                                 className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>

                {/* Search Settings Section */}
                <div className="flex flex-row align-middle lg:basis-1/4">
                    <div className={"flex flex-row items-center"}>
                        <ChevronLast/>
                    </div>
                    <div
                        className="sm:hidden md:hidden shadow-md w-full lg:flex lg:flex-col p-4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] ">
                        <h2 className="text-xl px-4 font-bold mb-4 text-red-950">Zoek Instellingen</h2>
                        <div className={"flex flex-col h-full px-4 overflow-y-auto max-h-[650px] " +
                            "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-red-950 scrollbar-track-red-50 h-32 overflow-"}>
                            <div role="status" className="max-w-sm animate-pulse mb-4">
                                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div role="status" className="max-w-sm animate-pulse mb-4">
                                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div role="status" className="max-w-sm animate-pulse mb-4">
                                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div role="status" className="max-w-sm animate-pulse mb-4">
                                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div role="status" className="max-w-sm animate-pulse mb-4">
                                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div role="status" className="max-w-sm animate-pulse mb-4">
                                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            </>
            );
            }