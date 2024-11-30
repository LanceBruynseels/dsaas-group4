'use client';
import React, { useEffect } from 'react';


// type declaration ---------->
declare global {
    interface Window {
        googleTranslateElementInit: any;
        google: any;
    }
}
// ===============================

const GoogleTranslate = () => {
    useEffect(() => {
        if (!window.googleTranslateElementInit) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.head.appendChild(script);

            window.googleTranslateElementInit = function () {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,fr,de,nl',
                        // layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    'google_translate_element'
                );
            };
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
                /* Hide Google Translate top frame (the bar) */
                iframe.goog-te-banner-frame {
                    display: none !important;
                }
                body {
                    position: static !important;
                    top: 0 !important;
                }

                /* Adjust the Google Translate widget's internal elements */
                #google_translate_element .goog-te-gadget {
                    font-size: 0.875rem; /* Small, clean font */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem; /* Space between icon and dropdown */
                    color: #771d1d; /* Match your theme */
                }

                /* Style the dropdown (select element) */
                #google_translate_element select {
                    border: 1px solid #ffab9f; /* Match the border color */
                    border-radius: 4px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    background-color: #ffffff;
                    color: #771d1d;
                    outline: none;
                    cursor: pointer;
                }

                /* On hover, change dropdown styling */
                #google_translate_element select:hover {
                    border-color: #771d1d;
                }

                /* Adjust Google Translate icon */
                #google_translate_element .goog-te-gadget-icon {
                    transform: scale(0.8); /* Make the icon smaller */
                }

                /* Prevent unwanted width expansion */
                #google_translate_element .goog-te-gadget {
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
};

export default GoogleTranslate;
