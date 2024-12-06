"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
        return <div>Loading products...</div>;
    }

    // Show error if it occurs
    if (error) {
        return (
            <div style={{ color: 'red' }}>
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
        <div className="flex w-screen h-5/6 lg:flex-row flex-col lg:w-full justify-center items-center ">

            {product3 && (
                <div
                    key={product3.id}
                    className="flex flex-col justify-center w-1/3 hover:w-2/3 transition-all duration-200 text-center items-center group h-screen  "
                >
                    <div
                        className="flex flex-col justify-between items-center gap-2 p-8 border-white rounded-2xl border-8 w-2/3 group-hover:bg-red-200 h-[66%] group-hover:w-10/12    ">
                        <h3 className="text-[2vw]">{product3.name}</h3>
                        <img src="/vlinder.png" alt="Vlinder Logo" className="aspect-square group-hover:hidden"/>
                        <p className=" group-hover:hidden  text-center text-transparent rounded-2xl p-2 y- "> Best value </p>
                        <p className="hidden group-hover:flex text-[1.5vw]">{product3.description}</p>
                        {product3.price && (
                            <p className="text-[2vw]">
                                € {product3.price / 100}
                            </p>
                        )}
                        <button
                            className="hidden group-hover:flex justify-center items-center w-1/3 h-fit p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[4vh] text-center"
                            onClick={() => handlePayment(product1.id)}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            )}
            {product2 && (
                <div
                    key={product2.id}
                    className="flex flex-col  justify-center w-1/3 hover:w-2/3 transition-all duration-200 text-center items-center group  h-screen"
                >
                    <div
                        className="flex flex-col justify-between items-center gap-2 p-8 border-white rounded-2xl border-8 w-2/3 group-hover:bg-red-200 group-hover:w-10/12  h-[66%]  ">
                        <h3 className="text-[2vw]">{product2.name}</h3>
                        <img src="/vlinder.png" alt="Vlinder Logo" className="aspect-square group-hover:hidden"/>
                        <p className=" group-hover:hidden  text-center text-transparent rounded-2xl p-2 y- "> Best value </p>
                        <p className="hidden group-hover:flex text-[1.5vw]">{product2.description}</p>
                        {product2.price && (
                            <p className="text-[2vw]">
                                € {product2.price / 100}
                            </p>
                        )}
                        <button
                            className="hidden group-hover:flex justify-center items-center w-1/3 h-fit p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[4vh] text-center"
                            onClick={() => handlePayment(product1.id)}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            )}
            {product1 && (
                <div
                    key={product1.id}
                    className="flex flex-col  justify-center w-1/3 hover:w-2/3  transition-all duration-200 text-center items-center group  h-screen "
                >
                    <div
                        className="flex flex-col justify-between items-center gap-2 p-8 border-white rounded-2xl border-8 w-2/3 group-hover:bg-red-200 group-hover:w-10/12  h-[66%] ">
                        <h3 className="text-[2vw]">{product1.name}</h3>
                        <img src="/vlinder.png" alt="Vlinder Logo" className="aspect-square group-hover:hidden"/>
                        <p className=" z-50 bg-green-300 text-center text-white rounded-2xl p-2 y- "> Best value </p>
                        <p className="hidden group-hover:flex text-[1.5vw]">{product1.description}</p>
                        {product1.price && (
                            <p className="text-[2vw]">
                                € {product1.price / 100}
                            </p>
                        )}
                        <button
                            className="hidden group-hover:flex justify-center items-center w-1/3 h-fit p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[4vh] text-center"
                            onClick={() => handlePayment(product1.id)}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductsPage;
