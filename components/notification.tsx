import React from "react";
import Image from "next/image";

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
    // Get sender's full name
    const senderName = `${notification.first_name_sender || "Someone"} ${notification.last_name_sender || ""}`.trim();

    // Default to a mock image if sender's profile image is not available
    const senderImage = notification.sender_profile_image || "/mock-picture.webp";

    // Set background color based on read status
    const bgColor = notification.is_read ? "bg-gray-100" : "bg-red-200";

    return (
        <div className={`flex flex-row my-2 items-center p-2 rounded-md shadow-md ${bgColor}`}>
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
