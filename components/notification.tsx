'use client'

import { useRouter } from 'next/navigation';
import React from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {redirect} from "next/navigation";

// Define the type for a single notification
export type Notification_user = {
    notification_id: number;
    user_id: string;
    type: string;
    is_read: boolean;
    notification_timestamp: string;
    content: string;
    first_name_sender: string | null;
    last_name_sender: string | null;
    sender_profile_image: string | null;
};

interface NotificationItemProps {
    notification: Notification_user;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const router = useRouter();
    const supabase = createClientComponentClient(); // Initialize Supabase client

    // Get sender's full name
    const senderName = `${notification.first_name_sender || "Someone"} ${notification.last_name_sender || ""}`.trim();

    // Default to a mock image if sender's profile image is not available
    const senderImage = notification.sender_profile_image || "/mock-picture.webp";

    // Set background color based on read status
    const bgColor = notification.is_read ? "" : "bg-red-300";

    // Function to handle notification click and mark it as read
    const handleNotificationClick = async () => {
        if (!notification.is_read) {
            try {
                const { error } = await supabase
                    .from("notifications") // Replace with your actual table name
                    .update({ is_read: true })
                    .eq("notification_id", notification.notification_id);

                if (error) {
                    console.error("Error marking notification as read:", error.message);
                } else {
                    console.log("Notification marked as read");
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        }

        if(notification.type === "message"){
            router.push('/messaging');
            router.refresh();
        }
    };

    return (
        <div
            className={`flex flex-row items-center p-2 cursor-pointer ${bgColor}`}
            onClick={handleNotificationClick} // Add click handler
        >
            {/* Profile Image */}
            <Image
                src={senderImage}
                alt={`${senderName}'s Profile Picture`}
                width={50}
                height={50}
                className="rounded-full border border-gray-500"
            />
            {/* Notification Content */}
            <div className="text-sm mx-2">
                <span className="font-semibold">{senderName}</span>
                <p>{notification.content}</p>
            </div>
        </div>
    );
};

export default NotificationItem;
