"use client";
import React, { useState } from 'react';


const teamMembers = [
    {name: 'NAME', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME', function: 'FUNCTION', description: 'description', picture: 'mock-picture.webp'},
    {name: 'NAME', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
];

const TeamSection = () => {
    const [currentImage, setCurrentImage] = useState(teamMembers[0].picture);

    return (
        <section className="bg-white w-screen h-screen flex flex-col items-center overflow-hidden justify-start gap-8 ">
            <div className="flex flex-col h-1/6">
                <h2 className="text-center sm:text-lg md:text-3xl lg:text-6xl xl:text-8xl text-red-950 ">
                    Meet our team
                </h2>
                <h2 className="text-center sm:text-lg md:text-lg lg:text-xl xl:text-xl text-red-950 ">
                    Meet our talented team of bright engineers that made this innovative project happen
                </h2>
            </div>
            <div className="flex flex-row w-screen h-3/6 bg-red-500 justify-center gap-8">
                <div className="flex w-3/12 h-full aspect-square bg-yellow-400">
                    <img src={currentImage}/>
                </div>
                <div className="flex w-5/12 h-full bg-green-300">
                    nen hele hoop text habibi
                </div>
            </div>
            <div className="flex flex-row w-screen h-1/6 bg-purple-600 gap-[5%] justify-center">

                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-start bg-red-800 border-2 border-red-950 rounded-lg aspect-square "
                    >
                        <div className="flex flex-col items-start text-center bg-black"
                             onMouseEnter={() => setCurrentImage(member.picture)}
                             onMouseLeave={() => setCurrentImage(member.picture)}>
                            <img src={member.picture}/>
                        </div>
                    </div>
                ))}


            </div>

        </section>
    );
};

export default TeamSection;