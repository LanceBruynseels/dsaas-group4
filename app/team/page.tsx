"use client";
import React, { useState } from 'react';


const teamMembers = [
    {name: 'NAME ONE', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME TWO', function: 'FUNCTION', description: 'description', picture: 'mock-picture.webp'},
    {name: 'NAME THREE', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME FOUR', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME Five', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
    {name: 'NAME SIX', function: 'FUNCTION', description: 'description', picture: 'vlinder.png'},
];

const TeamSection = () => {
    const [currentImage, setCurrentImage] = useState(teamMembers[0].picture);
    const [currentName, setCurrentName] = useState(teamMembers[0].name);
    const [currentFunction, setCurrentFunction] = useState(teamMembers[0].function);
    const [currentDescription, setCurrentDescription] = useState(teamMembers[0].description);

    return (
        <section className="bg-[#FDFDFD] w-screen h-screen flex flex-col items-center overflow-hidden justify-start gap-8 m ">
            <div className="flex flex-col h-1/6">
                <h2 className="text-center sm:text-lg md:text-3xl lg:text-6xl xl:text-8xl text-red-950 ">
                    Meet our team
                </h2>

            </div>
            <div className="flex flex-row w-screen h-3/6 justify-center gap-8">
                <div className="flex w-3/12 h-full aspect-square">
                    <img className="w-full h-full  border-2 border-red-950 rounded-2xl " src={currentImage}/>
                </div>
                <div className="flex flex-col w-5/12 h-full gap-4 p-4">
                    <p className="text-5xl text-[#6f5956] bg-[#d4c1f6]"> {currentName}</p>
                    <p className="text-3xl text-[#6f5956]"> {currentFunction}</p>
                    <p className="text-1xl text-[#6f5956]"> {currentDescription}</p>
                </div>
            </div>
            <div className="flex  flex-row w-screen h-1/6 gap-[5%] justify-center">

                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-start aspect-square "
                    >
                        <div className="flex flex-col items-start text-center"
                             onMouseEnter={() => {
                                 setCurrentImage(member.picture);
                                 setCurrentName(member.name);
                                 setCurrentFunction(member.function);
                                 setCurrentDescription(member.description)}}


                             onMouseLeave={() => {
                                 setCurrentImage(member.picture);
                                 setCurrentName(member.name);
                                 setCurrentFunction(member.function);
                                 setCurrentDescription(member.description);
                             }}>

                            <img className="border-2 border-red-950 rounded-2xl" src={member.picture}/>
                        </div>
                    </div>
                ))}


            </div>

        </section>
    );
};

export default TeamSection;