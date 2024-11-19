"use client";

import { SubmitButton } from "@components/submit-button";
import { useState } from "react";

interface SubmitProfileButtonProps {
    profileData: { firstName: string; lastName: string; distance: number; age: number };
    filterData: any;
    userId: string;
    onProfileUpdate?: () => void; // Optional callback for handling UI updates
}

export function SubmitProfileButton({
                                        profileData,
                                        filterData,
                                        userId,
                                        onProfileUpdate,
                                    }: SubmitProfileButtonProps) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        const payload = {
            userId,
            profile: {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                distance: profileData.distance,
                age: profileData.age,
            },
            filters: filterData,
        };

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.statusText}`);
            }

            if (onProfileUpdate) onProfileUpdate(); // Call optional UI update callback
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <SubmitButton
                pendingText="Vernieuw profiel..."
                className="px-4 py-2 text-white font-bold rounded-md hover:bg-red-600"
                style={{ backgroundColor: "#771D1D" }}
            >
                Vernieuw profiel
            </SubmitButton>
        </form>
    );
}
