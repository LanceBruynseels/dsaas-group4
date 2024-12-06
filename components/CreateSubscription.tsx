"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // router to navigate dynamically do the different payment page


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

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return (
            <div style={{ color: 'red' }}>
                <h3>Error:</h3>
                <p>{error}</p>
            </div>
        );
    }

    const handlePayment = (productId, ) => {
        router.push(`/payment/${productId}`);
    };

    return (

            <div className="flex lg:flex-row flex-col lg:w-full h-full justify-center items-center group transition-all duration-950 ">
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col h-full justify-center  w-1/3 lg:hover:w-full hover:w-2/3 transition-all duration-500 bg-red-300 hover:bg-red-700 text-center items-center">
                        <div className="flex flex-col justify-center items-center gap-4 border-white rounded-2xl border-8 w-2/3 aspect-square group-hover:border-0 transition-all duration-900">
                            <h3 className="peer-hover:hidden text-[4vw]">{product.name}</h3>
                            <p className="hidden group-hover:flex ">{product.description}</p>
                            {product.price && (
                                <p>
                                    Price: {product.price / 100} {product.currency.toUpperCase()}
                                </p>
                            )}
                            <button className="hidden group-hover:flex w-1/3 h-fit p-4 rounded-2xl border-red-950 bg-red-300 hover:bg-red-500 hover:text-white text-[4vh] transition-all duration:300"
                            onClick={()=> handlePayment(product.id)}>
                                pay
                            </button>
                        </div>
                    </div>
                ))}
            </div>

    );
};

export default ProductsPage;
