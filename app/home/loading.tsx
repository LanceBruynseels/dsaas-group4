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
                    className="flex flex-col basis-1/2 bg-gradient-to-b shadow-md from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg justify-center align-middle items-center">
                    <div className="text-center align-middle">
                        <>
                            <div className="flex flex-col justify-center items-center w-full h-full">
                                <div
                                    className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-950"></div>
                                <p className="text-red-950 mt-4 text-lg">Loading...</p>
                            </div>
                        </>
                    </div>
                </div>

                {/* Search Settings Section */}
                <div className="flex flex-row align-middle lg:basis-1/4">
                    <div className={"flex flex-row items-center p-1.5 rounded-lg "}>
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