import React from "react";
import Image from "next/image";

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-950"></div>
            <p className="text-red-950 mt-4 text-lg">Loading...</p>
        </div>
    );
};

export default Loading;
