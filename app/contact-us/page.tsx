"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const ContactUsPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        organisation: ''
    });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Simulating form submission (Replace with actual API request logic)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setFormData({ name: '', email: '', message: '', organisation: 'optional' });
            router.push('contact-us/thank-you');
        } catch (err) {
            setError("There was an error submitting your message. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <Image src="/vlinder.png" alt="Vlinder Logo" width={200} height={200} priority />
                    <h1 className="text-5xl font-bold text-gray-800">Contact Us</h1>
                    <p className="text-gray-800 text-xl">Any questions about our product? Let us know!</p>
                </div>

                {/* Right Side: Contact Form */}
                <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg" style={{ backgroundColor: "#771D1D" }}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="name">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                Your Organisation
                            </label>
                            <input
                                type="text"
                                id="organisation"
                                name="organisation"
                                value={formData.organisation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="email">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1" htmlFor="message">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                                rows={4}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{backgroundColor: '#FCA5A5'}}
                            className="w-full hover:bg-pink-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
                        >
                            {isLoading ? "Sending message..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
