import React from "react";
import { SubmitButton } from "@components/submit-button";
import LanguageSettingsAction from "@/app/actions/settings/language/action";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

const LanguageSettingsPage = async () => {
    // Fetch the translations using the i18n hook
    const { t } = useTranslation('settings');  // Assuming you have a 'settings' namespace

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t('settingsTitle')}</h2>  {/* Translated title */}
                    <SubmitButton
                        className="px-6 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{ backgroundColor: "#771D1D" }}
                    >
                        {t('logoutButton')}  {/* Translated logout button text */}
                    </SubmitButton>
                </div>
                <ul className="space-y-4 flex-1">
                    <li className="text-base text-gray-500 cursor-pointer hover:text-gray-900">
                        <Link href="/settings">{t('profile')}</Link>  {/* Translated profile link */}
                    </li>
                    <li className="text-base font-semibold text-[#771D1D] cursor-pointer hover:text-gray-700">
                        <Link href="/settings/language">{t('languageSettings')}</Link>  {/* Translated language settings link */}
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] flex-grow justify-center items-center">
                <LanguageSettingsAction />
            </div>
        </div>
    );
};

export default LanguageSettingsPage;
