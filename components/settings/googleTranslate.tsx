"use client";
import React, { useEffect } from 'react';

declare global {
    interface Window {
        googleTranslateElementInit: any;
        google: any;
    }
}

const GoogleTranslate = () => {
    useEffect(() => {
        const loadGoogleTranslateScript = () => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            script.onload = () => {
                if (window.google && window.google.translate) {
                    window.googleTranslateElementInit();
                }
            };
            script.onerror = () => {
                console.error('Failed to load Google Translate script.');
            };
            document.head.appendChild(script);
        };

        if (!window.googleTranslateElementInit) {
            window.googleTranslateElementInit = function () {
                try {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            includedLanguages: 'en,fr,de,nl',
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        },
                        'google_translate_element'
                    );
                } catch (error) {
                    console.error('Error initializing Google Translate:', error);
                }
            };
            loadGoogleTranslateScript();
        } else if (window.google && window.google.translate) {
            window.googleTranslateElementInit();
        }
    }, []);

    return (
        <div className="w-full max-w-md p-6 bg-pink-100 rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] shadow-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#771D1D]">
                Taal Instellingen
            </h2>
            <div className="space-y-6 flex justify-center items-center">
                <div
                    id="google_translate_element"
                    className="p-2 bg-white border border-[#FFAB9F] rounded-md shadow-sm w-full max-w-xs text-center flex justify-center items-center gap-2"
                ></div>
            </div>
            <style jsx>{`
                iframe.goog-te-banner-frame {
                    display: none !important;
                }
                body {
                    position: static !important;
                    top: 0 !important;
                }
                #google_translate_element .goog-te-gadget {
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #771d1d;
                }
                #google_translate_element select {
                    border: 1px solid #ffab9f;
                    border-radius: 4px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    background-color: #ffffff;
                    color: #771d1d;
                    outline: none;
                    cursor: pointer;
                }
                #google_translate_element select:hover {
                    border-color: #771d1d;
                }
                #google_translate_element .goog-te-gadget-icon {
                    transform: scale(0.8);
                }
                #google_translate_element .goog-te-gadget {
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
};

export default GoogleTranslate;
