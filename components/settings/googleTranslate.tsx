'use client';
import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Prevent script from being added multiple times
        if (!window.googleTranslateElementInit) {
            // Dynamically load Google Translate script
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);

            // Initialize Google Translate widget once
            window.googleTranslateElementInit = function () {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,fr,de,nl',
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    'google_translate_element'
                );
            };
        } else if (window.google && window.google.translate) {
            // Re-initialize if script is already loaded
            window.googleTranslateElementInit();
        }
    }, []);

    return (

        <div className="w-full max-w-md p-6 bg-pink-100 rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
            <h2 className="text-2xl font-bold mb-6 text-center">Taal Instellingen</h2>
            <div className="space-y-6">
                <div
                    id="google_translate_element"
                    className="mt-4 p-2 w-72 text-center">
                </div>
            </div>
        </div>
    );
};

export default GoogleTranslate;
