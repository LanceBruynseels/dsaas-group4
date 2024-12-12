"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from "flowbite-react";


const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // router to navigate dynamically to the different payment page

    // Fetch the list of products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null); // Reset previous errors

            try {
                const res = await fetch('/api/payment/subscriptions'); // API request to get products
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await res.json();
                setProducts(data); // Set products data in the state
            } catch (err) {
                setError(err.message); // Set error if the fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-950"></div>
                <p className="text-red-950 mt-4 text-lg">Loading...</p>
            </div>
        );
    }

    // Show error if it occurs
    if (error) {
        return (
            <div style={{color: 'red'}}>
                <h3>Error:</h3>
                <p>{error}</p>
            </div>
        );
    }

    // Destructure products array into individual variables
    const [product1, product2, product3] = products;

    // Handle navigation to the payment page
    const handlePayment = (productId) => {
        router.push(`/payment/${productId}`);
    };

    return (
        <div className="flex flex-col w-full h-full justify-start items-center gap-8">
            <h1 className="flex flex-col justify-center items-center bg-red-950 text-white lg:w-[80%] w-[90%] h-[10%] lg:text-[8vh] text-[6vw]">Choose your plan!</h1>

            <div className="flex lg:flex-row flex-col justify-center items-center gap-4 w-full lg:aspect-[4/1] aspect[1/4]">

                {product3 && (
                    <div
                        key={product3.id}
                        className="flex flex-col justify-center items-center lg:w-[25%] w-[80%] transition-all duration-200 text-center group aspect-[1/1] lg:hover:aspect-[3/2] lg:hover:w-[40%] "
                    >
                        <div className="flex flex-col justify-between items-center gap-[1%] p-[5%] border-white rounded-2xl border-8 w-[90%] group-hover:bg-red-200 h-[90%] lg:group-hover:w-[90%]">
                            <h3 className="text-[2vw] h-[15%]">{product3.name}</h3>
                            <img src="/vlinder.png" alt="Vlinder Logo" className="aspect-square group-hover:hidden h-[50%]"/>
                            <p className=" group-hover:hidden  text-center text-transparent rounded-2xl p-2  text-[1vh]"> Best value </p>
                            <p className="hidden group-hover:flex text-[1.5vw]">{product3.description}</p>
                            {product3.price && (
                                <p className="lg:text-[2vw] text-[4vw] h-[15%] w-full">
                                    € {product3.price / 100}
                                </p>
                            )}
                            <button
                                className="hidden group-hover:flex justify-center items-center h-[10%] aspect-[3/1] p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[2vh] text-center"
                                onClick={() => handlePayment(product3.id)}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                )}
                {product2 && (
                    <div
                        key={product2.id}
                        className="flex flex-col justify-center items-center lg:w-[25%] w-[80%] transition-all duration-200 text-center group aspect-[1/1] lg:hover:aspect-[3/2] lg:hover:w-[40%] "
                    >
                    <div className="flex flex-col justify-between items-center gap-[1%] p-[5%] border-white rounded-2xl border-8 w-[90%] group-hover:bg-red-200 h-[90%] lg:group-hover:w-[90%]">
                            <h3 className="text-[2vw] h-[15%]">{product2.name}</h3>
                            <img src="/vlinder.png" alt="Vlinder Logo" className="aspect-square group-hover:hidden h-[50%]"/>
                            <p className=" group-hover:hidden  text-center text-transparent rounded-2xl p-2  text-[1vh] "> Best value </p>
                            <p className="hidden group-hover:flex text-[1.5vw]">{product2.description}</p>
                            {product2.price && (
                                <p className="lg:text-[2vw] text-[4vw] h-[15%] w-full">
                                    € {product2.price / 100}
                                </p>
                            )}
                            <button
                                className="hidden group-hover:flex justify-center items-center h-[10%] aspect-[3/1] p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[2vh] text-center"
                                onClick={() => handlePayment(product2.id)}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                )}
                {product1 && (
                    <div
                        key={product1.id}
                        className="flex flex-col justify-center items-center lg:w-[25%] w-[80%] transition-all duration-200 text-center group aspect-[1/1] lg:hover:aspect-[3/2] lg:hover:w-[40%] "
                    >
                    <div className="flex flex-col justify-between items-center gap-[1%] p-[5%] border-white rounded-2xl border-8 w-[90%] group-hover:bg-red-200 h-[90%] lg:group-hover:w-[90%]">
                            <h3 className="text-[2vw] h-[15%]">{product1.name}</h3>
                            <img src="/vlinder.png" alt="Vlinder Logo" className="aspect-square group-hover:hidden h-[50%]"/>
                            <p className=" text-center text-white rounded-2xl p-2 bg-green-600 text-[1vh] "> Best value </p>
                            <p className="hidden group-hover:flex text-[1.5vw]">{product1.description}</p>
                            {product1.price && (
                                <p className="lg:text-[2vw] text-[4vw] h-[15%] w-full">
                                    € {product1.price / 100}
                                </p>
                            )}
                            <button
                                className="hidden group-hover:flex justify-center items-center h-[10%] aspect-[3/1] p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[2vh] text-center"
                                onClick={() => handlePayment(product1.id)}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductsPage;
