import Image from "next/image";
import React from "react";

function VlinderPage() {
    return (
        <div className="flex w-screen h-screen flex-col lg:flex-row overflow-x-hidden overflow-y-auto">
            {/* Main Content Section */}
            <div className="flex flex-col items-end w-full lg:w-3/4 h-auto lg:h-screen">
                <div className="relative w-full h-auto lg:h-5/6 bg-red-50 flex flex-col lg:flex-row p-6 lg:p-16">
                    <div className="flex flex-col w-full lg:w-4/6 text-justify gap-4 max-h-full">
                        <h1 className="text-3xl lg:text-5xl font-bold bg-[#a0d5c0] text-[#FDFDFD] px-4 py-2">
                            Vlinder
                        </h1>
                        <p className="text-black mb-4 lg:mb-8 mx-2 lg:mx-4 text-sm lg:text-base leading-6 lg:leading-8">
                            Some information about the app some information about the app some information about
                            the app some information about the app some information about the app some information
                            about the app some information about the app some information about the app some
                            information about the app some information about the app
                            Some information about the app some information about the app some information about
                            the app some information about the app some information about the app some information
                            about the app some information about the app some information about the app some
                            information about the app some information about the app
                        </p>

                    </div>
                </div>
                <div className="h-5 bg-gradient-to-b from-[#FFAB9F] to-[#FFDFDB] "></div>
                <div
                    className="bg-[#6f5956] flex flex-row justify-center lg:justify-end w-full h-auto lg:h-1/6 p-4 lg:p-0">
                    <div
                        className="flex flex-row w-full lg:w-5/6 justify-center lg:justify-end items-center gap-x-4 lg:gap-x-[2.5%] mx-0 lg:mx-16">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="aspect-square h-12 lg:h-[90%] rounded-full bg-gray-300"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-5 bg-gradient-to-b from-[#FFAB9F] to-[#FFDFDB] "></div>

            {/* Floating Section */}
            <div
                className="relative lg:absolute flex flex-col w-11/12 lg:w-1/4 items-center z-50 shadow-sm shadow-black p-6 lg:p-[3vh] gap-6 lg:gap-[3vh] mx-auto lg:m-16 border bg-[#FDFDFD]">
                <Image
                    src="/vlinder.png"
                    alt="Vlinder Logo"
                    width={50}
                    height={50}
                    className="aspect-square rounded-xl"
                />
                <p className="p-4 text-center text-gray-700 text-lg lg:text-2xl font-bold mx-2 lg:mx-4">
                    A VERY INSPIRATIONAL QUOTE WE WORK BY
                </p>
                <p className="text-center text-gray-700 mx-2 lg:mx-4 text-sm lg:text-base leading-5 lg:leading-6">
                    Some Quote
                </p>
            </div>
        </div>
    );
}

export default VlinderPage;
