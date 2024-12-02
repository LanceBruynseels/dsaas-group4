"use client";

import { Carousel } from "flowbite-react";

export function FlowbiteCarousel({ pictures = [] }) { // Destructure the pictures property
    console.log("Inside the FlowbiteCarousel:", pictures);

    return (
        <div className="flex flex-col basis-1/2 m-2 h-full bg-gradient-to-b from-gray-50 to-gray-200 rounded-lg shadow-md">
            <Carousel className={"w-full"}>
                {pictures.length > 0 ? (
                    pictures.map((picture, index) => (
                        <img key={index} src={picture} alt={`Slide ${index + 1}`} width={200}/>
                    ))
                ) : (
                    <img src="/mock-picture.webp" alt="Default slide" />
                )}
            </Carousel>
        </div>
    );
}
