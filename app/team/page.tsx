import React from 'react';

const teamMembers = [
    { name: 'NAME', function: 'FUNCTION', description: 'description' },
    { name: 'NAME', function: 'FUNCTION', description: 'description' },
    { name: 'NAME', function: 'FUNCTION', description: 'description' },
    { name: 'NAME', function: 'FUNCTION', description: 'description' },
    { name: 'NAME', function: 'FUNCTION', description: 'description' },
    { name: 'NAME', function: 'FUNCTION', description: 'description' },
];

const TeamSection = () => {
    return (
        <section className="bg-white  w-full flex flex-col items-center justify-start py-12 px-4 gap-12">
            <h2 className="text-center mt-16 sm:text-lg md:text-3xl lg:text-6xl xl:text-8xl text-red-950 mb-8">
                Meet our team
            </h2>
            <h2 className="text-center sm:text-lg md:text-lg lg:text-xl xl:text-xl text-red-950 mb-8">
                Meet our talented team of bright engineers that made this innovative poject happen
            </h2>
            <div className="flex w-screen  flex-wrap justify-center sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24 px-4">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-start bg-red-200 border-2 border-red-950  gap-6 rounded-lg transition transform hover:scale-150 hover:z-10 w-full md:w-5/12 lg:w-1/3"
                    >
                        <div className="w-1/2 aspect-square bg-black rounded-md mb-4 md:mb-0 md:mr-4 sm:m-6 md:m-10 lg:m-14 xl:m-18"></div>
                        <div className="flex flex-col items-start text-center gap-2">
                            <h3 className="sm:text-lg md:text-1xl lg:text-3xl xl:text-5xl font-bold sm:mt-6 md:mt-10 lg:mt-14 xl:mt-18">{member.name}</h3>
                            <p className="sm:text-lg md:text-1xl lg:text-2xl xl:text-3xl text-gray-600">{member.function}</p>
                            <p className="sm:text-lg md:text-1xl lg:text-2xl xl:text-2xl text-gray-500 mt-4">{member.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
