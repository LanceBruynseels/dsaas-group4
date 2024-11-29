import Image from "next/image";

function VlinderPage() {
    return (
        <div className="flex w-screen h-screen flex-row overflow-x-hidden overflow-y-hidden">
            <div className="h-screen flex flex-col items-end">

                <div className="relative w-full h-5/6 bg-red-50 flex flex-row p-16">
                    <div className="flex flex-col w-4/6 ml-auto text-justify gap-4 overflow-hidden max-h-full">
                        <h1 className="text-5xl font-bold bg-[#a0d5c0] text-[#FDFDFD] px-4 py-2">Vlinder</h1>
                        <p className="text-black mb-8 mx-4">
                            Some information about the app some information about the app some information about
                            the app some information about the app some information about the app some information
                            about the app some information about the app some information about the app some
                            information about the app some information about the app
                            Some information about the app some information about the app some information about
                            the app some information about the app some information about the app some information
                            about the app some information about the app some information about the app some
                            information about the app some information about the app
                            Some information about the app some information about the app some information about
                            the app some information about the app some information about the app some information
                            about the app some information about the app some information about the app some
                            information about the app some information about the app
                            Some information about the app some information about the app some information about
                            the app some information about the app some information about the app some information
                            about the app some information about the app some information about the app some
                            information about the app some information about the app
                            Some information about the app some information about the app some information about


                        </p>
                        <button
                            className="bg-[#d4c1f6] text-white w-full h-[10%] rounded-full text-lg font-semibold shadow-sm  hover:bg-[#ffbbed] transition-all duration-300 hover:text-[#FDFDFD]">
                            BIGBUTTON
                        </button>
                    </div>
                </div>

                <div className="bg-[#6f5956] flex flex-row justify-end w-full h-1/6 ">
                    <div className="flex flex-row w-5/6 justify-end items-center gap-x-[2.5%] p-[2vh] mx-16 ">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="aspect-square h-[90%] rounded-[50%]  bg-gray-300"></div>
                        ))}
                    </div>
                </div>


            </div>

            <div
                className="absolute flex flex-col w-1/4 items-center z-50  shadow-sm shadow-black p-[3vh] gap-[3vh] m-16 border aspect-[20/32]  bg-[#FDFDFD]">
                <Image src="vlinder.png" alt="Vlinder Logo" width={50} height={50} className="aspect-square rounded-xl "></Image>
                <p className="text-center text-gray-700 text-2xl font-bold mx-4">A VERY INSPIRATIONAL QUOTE WE WORK BY</p>
                <p className="text-center text-gray-700 mx-4 h-max-^[20vh]">A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.A lot more text here.</p>
            </div>
        </div>
    );
}

export default VlinderPage;
