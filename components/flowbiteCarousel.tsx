"use client";

import { Carousel } from "flowbite-react";

export function FlowbiteCarousel({ pictures = [] }) { // Destructure the pictures property
    console.log("Inside the FlowbiteCarousel:", pictures);

    return (
        <div className="flex flex-col w-full">
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
