"use client";
import React, { useState } from 'react';
import Image from "next/image";


const teamMembers = [
    {name: 'Anton Ceusters', function: 'Software Engineer', description: 'description', picture: 'vlinder.png'},
    {name: 'Datao Liang', function: 'Software Engineer', description: 'description', picture: 'mock-picture.webp'},
    {name: 'Joran Vleugels', function: 'Software Engineer', description: 'description', picture: 'vlinder.png'},
    {name: 'Lance Bruynseels', function: 'Software Engineer', description: 'description', picture: 'vlinder.png'},
    {name: 'Manuel Pollet', function: 'Software Engineer', description: 'description', picture: 'vlinder.png'},
    {name: 'Rohan Bhattaram', function: 'Software Engineer', description: 'description', picture: 'vlinder.png'},
];

const TeamSection = () => {
    const [currentImage, setCurrentImage] = useState(teamMembers[0].picture);
    const [currentName, setCurrentName] = useState(teamMembers[0].name);
    const [currentFunction, setCurrentFunction] = useState(teamMembers[0].function);
    const [currentDescription, setCurrentDescription] = useState(teamMembers[0].description);

    return (
        <section className="bg-white w-screen h-screen flex flex-col items-center overflow-hidden justify-start gap-8">
            <div className="flex flex-col h-1/6">
                <h2 className="text-center w-screen p-4 m-4 font-bold  text-7xl text-white bg-[#d4c1f6] ">
                    Meet our team
                </h2>

            </div>
            <div className="flex flex-row w-screen h-3/6 justify-center gap-8">
                <div className="flex w-3/12 h-full aspect-square">
                    <Image fill className="w-full h-full  border-4 border-[#6f5956] rounded-2xl " src={currentImage}
                           alt={'someImage'}/>
                </div>
                <div className="flex flex-col w-5/12 h-full gap-4 p-3">
                    <p className="text-5xl bg-[#a0d5c0] text-white p-4"> {currentName}</p>
                    <p className="text-3xl text-[#6f5956] mx-2"> {currentFunction}</p>
                    <p className="text-1xl text-[#6f5956] mx-2"> {currentDescription}</p>
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

                            <Image className="border-2 border-[#6f5956] rounded-2xl hover:border-[#a0d5c0] hover:border-4" src={member.picture} alt={'memberPicture'}/>
                        </div>
                    </div>
                ))}


            </div>

        </section>
    );
};

export default TeamSection;