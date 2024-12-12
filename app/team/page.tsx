"use client";
import React, { useState } from 'react';
import Image from "next/image";

const teamMembers = [
    { name: 'Anton Ceusters', function: 'Software Engineer', description: 'Anton is a meticulous problem-solver with a knack for designing scalable software solutions. He thrives on creating efficient and elegant code, ensuring seamless user experiences and innovative functionality.', picture: '/anton.jpg' },
    { name: 'Datao Liang', function: 'Software Engineer', description: 'Datao is a creative thinker with a passion for full-stack development. His expertise spans frontend design and backend architecture, making him an invaluable team player who bridges the gap between functionality and aesthetics.', picture: '/datao.png' },
    { name: 'Joran Vleugels', function: 'Software Engineer', description: 'Joran brings an analytical mindset to the team, excelling at debugging and optimizing complex systems. His collaborative spirit and technical expertise ensure every project reaches its full potential.', picture: '/joran.jpg' },
    { name: 'Lance Bruynseels', function: 'Software Engineer', description: 'Lance is a forward-thinker who specializes in automation and innovative technologies. With a passion for staying ahead of industry trends, he constantly pushes boundaries to deliver cutting-edge solutions.', picture: '/lance.jpg' },
    { name: 'Manuel Pollet', function: 'Software Engineer', description: 'Manuel is a detail-oriented developer with a strong focus on performance optimization and clean code. His methodical approach ensures reliability and robustness in every application he touches.', picture: '/manuel.jpeg' },
    { name: 'Rohan Bhattaram', function: 'Software Engineer', description: 'Rohan is a passionate developer with a flair for creative problem-solving. Whether it\'s designing intuitive user interfaces or tackling backend challenges, he brings energy and innovation to the team.', picture: '/rohan.png' },
];

const TeamSection = () => {
    const [currentImage, setCurrentImage] = useState(teamMembers[0].picture);
    const [currentName, setCurrentName] = useState(teamMembers[0].name);
    const [currentFunction, setCurrentFunction] = useState(teamMembers[0].function);
    const [currentDescription, setCurrentDescription] = useState(teamMembers[0].description);

    return (
        <section className="bg-gray-50 w-screen min-h-screen flex flex-col items-center overflow-hidden justify-start py-12">
            {/* Section Title */}
            <div className="mb-8">
                <h2 className="text-5xl font-bold text-gray-800 text-center">Meet Our Team</h2>
                <p className="text-lg text-gray-600 text-center mt-2">Get to know the people behind the code</p>
            </div>

            {/* Highlighted Team Member */}
            <div className="flex flex-col md:flex-row items-center justify-center w-10/12 gap-8 mb-12">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden">
                    <Image
                        src={currentImage}
                        alt="currentTeamMemberImage"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="flex flex-col items-start w-full md:w-6/12 gap-4">
                    <p className="text-4xl font-semibold text-[#771D1D]">{currentName}</p>
                    <p className="text-2xl text-gray-700">{currentFunction}</p>
                    <p className="text-md text-gray-600">{currentDescription}</p>
                </div>
            </div>

            {/* Team Member Thumbnails */}
            <div className="flex flex-wrap justify-center gap-6 w-10/12">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center w-36 hover:scale-105 transition-transform duration-200"
                        onMouseEnter={() => {
                            setCurrentImage(member.picture);
                            setCurrentName(member.name);
                            setCurrentFunction(member.function);
                            setCurrentDescription(member.description);
                        }}
                    >
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                            <Image
                                src={member.picture}
                                alt="memberPicture"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-2 text-sm font-medium text-gray-800">{member.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
