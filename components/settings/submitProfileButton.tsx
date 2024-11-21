"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/submit-button";

type SubmitProfileButtonProps = {
    profileData: {
        firstName: string;
        lastName: string;
        dob: string | null;
        distance: number;
    };
    filterData: Record<string, any>;
    userId: string;
};

export function SubmitProfileButton({ profileData, filterData, userId }: SubmitProfileButtonProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    profileData,
                    filterData,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            console.log("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SubmitButton
            pendingText="Opslaan..."
            disabled={isSubmitting}
            onClick={handleSubmit}
        >
            Opslaan
        </SubmitButton>
    );
}
