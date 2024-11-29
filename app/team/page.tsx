"use client";
import React, { useState } from 'react';


const teamMembers = [
    {name: 'Anton Ceusters', function: 'Software Engineer', description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit dignissim ridiculus ridiculus consequat dictumst nam faucibus. Imperdiet dignissim magnis finibus iaculis feugiat penatibus faucibus justo sollicitudin. Nec eros aliquam bibendum quam enim nec luctus cubilia. Quisque mus sed magnis aptent metus arcu mollis non montes. Duis non ligula blandit congue placerat; tempor cubilia tristique maximus. Potenti quam lacinia interdum id sapien. Sed vestibulum ex sociosqu nam sagittis penatibus suspendisse mi. Augue tristique montes ante felis lobortis, odio luctus. Conubia pulvinar auctor nulla rhoncus eleifend conubia conubia est. Habitasse mollis rhoncus faucibus vehicula netus facilisi montes. Ipsum morbi malesuada mauris porta vivamus id purus ipsum phasellus. Quis eleifend orci diam praesent luctus neque. Semper porta tincidunt egestas curae orci per eros.', picture: 'vlinder.png'},
    {name: 'Datao Liang', function: 'Software Engineer', description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit dignissim ridiculus ridiculus consequat dictumst nam faucibus. Imperdiet dignissim magnis finibus iaculis feugiat penatibus faucibus justo sollicitudin. Nec eros aliquam bibendum quam enim nec luctus cubilia. Quisque mus sed magnis aptent metus arcu mollis non montes. Duis non ligula blandit congue placerat; tempor cubilia tristique maximus. Potenti quam lacinia interdum id sapien. Sed vestibulum ex sociosqu nam sagittis penatibus suspendisse mi. Augue tristique montes ante felis lobortis, odio luctus. Conubia pulvinar auctor nulla rhoncus eleifend conubia conubia est. Habitasse mollis rhoncus faucibus vehicula netus facilisi montes. Ipsum morbi malesuada mauris porta vivamus id purus ipsum phasellus. Quis eleifend orci diam praesent luctus neque. Semper porta tincidunt egestas curae orci per eros.', picture: 'mock-picture.webp'},
    {name: 'Joran Vleugels', function: 'Software Engineer', description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit dignissim ridiculus ridiculus consequat dictumst nam faucibus. Imperdiet dignissim magnis finibus iaculis feugiat penatibus faucibus justo sollicitudin. Nec eros aliquam bibendum quam enim nec luctus cubilia. Quisque mus sed magnis aptent metus arcu mollis non montes. Duis non ligula blandit congue placerat; tempor cubilia tristique maximus. Potenti quam lacinia interdum id sapien. Sed vestibulum ex sociosqu nam sagittis penatibus suspendisse mi. Augue tristique montes ante felis lobortis, odio luctus. Conubia pulvinar auctor nulla rhoncus eleifend conubia conubia est. Habitasse mollis rhoncus faucibus vehicula netus facilisi montes. Ipsum morbi malesuada mauris porta vivamus id purus ipsum phasellus. Quis eleifend orci diam praesent luctus neque. Semper porta tincidunt egestas curae orci per eros.', picture: 'vlinder.png'},
    {name: 'Lance Bruynseels', function: 'Software Engineer', description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit dignissim ridiculus ridiculus consequat dictumst nam faucibus. Imperdiet dignissim magnis finibus iaculis feugiat penatibus faucibus justo sollicitudin. Nec eros aliquam bibendum quam enim nec luctus cubilia. Quisque mus sed magnis aptent metus arcu mollis non montes. Duis non ligula blandit congue placerat; tempor cubilia tristique maximus. Potenti quam lacinia interdum id sapien. Sed vestibulum ex sociosqu nam sagittis penatibus suspendisse mi. Augue tristique montes ante felis lobortis, odio luctus. Conubia pulvinar auctor nulla rhoncus eleifend conubia conubia est. Habitasse mollis rhoncus faucibus vehicula netus facilisi montes. Ipsum morbi malesuada mauris porta vivamus id purus ipsum phasellus. Quis eleifend orci diam praesent luctus neque. Semper porta tincidunt egestas curae orci per eros.', picture: 'vlinder.png'},
    {name: 'Manuel Pollet', function: 'Software Engineer', description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit dignissim ridiculus ridiculus consequat dictumst nam faucibus. Imperdiet dignissim magnis finibus iaculis feugiat penatibus faucibus justo sollicitudin. Nec eros aliquam bibendum quam enim nec luctus cubilia. Quisque mus sed magnis aptent metus arcu mollis non montes. Duis non ligula blandit congue placerat; tempor cubilia tristique maximus. Potenti quam lacinia interdum id sapien. Sed vestibulum ex sociosqu nam sagittis penatibus suspendisse mi. Augue tristique montes ante felis lobortis, odio luctus. Conubia pulvinar auctor nulla rhoncus eleifend conubia conubia est. Habitasse mollis rhoncus faucibus vehicula netus facilisi montes. Ipsum morbi malesuada mauris porta vivamus id purus ipsum phasellus. Quis eleifend orci diam praesent luctus neque. Semper porta tincidunt egestas curae orci per eros.', picture: 'vlinder.png'},
    {name: 'Rohan Bhattaram', function: 'Software Engineer', description: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Hendrerit dignissim ridiculus ridiculus consequat dictumst nam faucibus. Imperdiet dignissim magnis finibus iaculis feugiat penatibus faucibus justo sollicitudin. Nec eros aliquam bibendum quam enim nec luctus cubilia. Quisque mus sed magnis aptent metus arcu mollis non montes. Duis non ligula blandit congue placerat; tempor cubilia tristique maximus. Potenti quam lacinia interdum id sapien. Sed vestibulum ex sociosqu nam sagittis penatibus suspendisse mi. Augue tristique montes ante felis lobortis, odio luctus. Conubia pulvinar auctor nulla rhoncus eleifend conubia conubia est. Habitasse mollis rhoncus faucibus vehicula netus facilisi montes. Ipsum morbi malesuada mauris porta vivamus id purus ipsum phasellus. Quis eleifend orci diam praesent luctus neque. Semper porta tincidunt egestas curae orci per eros.', picture: 'vlinder.png'},
];

const TeamSection = () => {
    const [currentImage, setCurrentImage] = useState(teamMembers[0].picture);
    const [currentName, setCurrentName] = useState(teamMembers[0].name);
    const [currentFunction, setCurrentFunction] = useState(teamMembers[0].function);
    const [currentDescription, setCurrentDescription] = useState(teamMembers[0].description);

    React.useEffect(() => {
        document.title = "About the team page";
    }, []);

    return (


        <section
            className="lg:w-screen lg:h-screen bg-white flex flex-col items-center justify-between gap-4 overflow-x-hidden overflow-y-auto p-8 h-fit space-y-4">

            <div className="flex flex-col h-fit w-screen items-center justify-center">
                <h2 className="flex items-center justify-center text-center w-5/6 h-full font-bold text-[5vw] text-white bg-red-950">
                    Meet our team
                </h2>
            </div>

            <div className="flex lg:flex-row lg:justify-center lg:items-center h-fit lg:w-4/6 w-5/6  gap-8 flex-col items-center  ">
                <div className="flex flex-col justify-center lg:w-[40%] w-[70%] aspect-square ">
                    <img
                        className="flex flex-col aspect-square lg:h-full object-cover border-4 border-red-950 rounded-2xl"
                        src={currentImage}
                        alt="Team member"
                    />
                </div>
                <div className="flex flex-col justify-center lg:w-[60%] sm:h-full gap-4 p-3 w-full">
                    <p className="flex flex-row justify-start items-center h-fit text-[3vw] bg-red-700 text-white p-4  ">{currentName}</p>
                    <p className="h-fit lg:text-[2vw] text-[2.5vw] mx-2 ">{currentFunction}</p>
                    <p className="h-fit lg:text-[1vw] text-[2vw] mx-2">{currentDescription}</p>
                </div>
            </div>


            <div className="flex flex-row w-5/6 h-fit gap-[5%] justify-center">

                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-start w-1/12 aspect-square "
                    >
                        <div className="flex flex-col items-start text-center"
                             onMouseEnter={() => {
                                 setCurrentImage(member.picture);
                                 setCurrentName(member.name);
                                 setCurrentFunction(member.function);
                                 setCurrentDescription(member.description)
                             }}


                             onMouseLeave={() => {
                                 setCurrentImage(member.picture);
                                 setCurrentName(member.name);
                                 setCurrentFunction(member.function);
                                 setCurrentDescription(member.description);
                             }}>

                            <img className="border-2 border-red-950 rounded-2xl hover:border-red-700 hover:border-4"
                                 src={member.picture}
                                 alt="SelectionPic"/>
                        </div>
                    </div>
                ))}


            </div>

        </section>
    );
};

export default TeamSection;