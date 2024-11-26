import React from "react";
import Image from "next/image";

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
            <div className="flex flex-col items-center">
                <Image src="/loading-spinner.gif" alt="Loading" width={50} height={50} />
                <h2 className="mt-4 text-lg font-bold text-red-700">Even geduld...</h2>
            </div>
        </div>
    );
};

export default Loading;
