'use client'

import {useRouter} from 'next/navigation';
import React, {useState} from "react";
import Image from "next/image";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {redirect} from "next/navigation";
import {UserPopup} from "@components/userPopup";

export interface UserPopUp {
    id: number;
    profile_picture_url: string;
    location: string | null;
    user_id: string;
    dob: string;
    first_name: string;
    last_name: string;
    profile_data: {
        disabilities: string[];
        distance: string | null;
        genders: string[];
        home_status: string[];
        interests: string[];
        personalities: string[];
        relationship_goals: string[];
        religions: string[];
    };
    publicUrls: string[];
}

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
    sender_id: string;
};

interface NotificationItemProps {
    notification: Notification_user,
    expanded: boolean,
}

const NotificationItem: React.FC<NotificationItemProps> = ({notification, expanded}: NotificationItemProps) => {
    const router = useRouter();
    const supabase = createClientComponentClient(); // Initialize Supabase client
    const [openMatchPopup, setOpenMatchPopup] = useState(false); // State for managing the popup
    const [currentMatch, setCurrentMatch] = useState(null); // Store current match details

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
                const {error} = await supabase
                    .from("notifications")
                    .update({is_read: true})
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

        if (notification.type === "message") {
            router.push('/messaging');
            router.refresh();
        } else if (notification.type === "match") {
            try {
                const {data: matchInfoData, error: matchInfoError} = await supabase.rpc('get_match_info', {match_user_id: notification.sender_id})

                const match  = matchInfoData[0];

                if(match){
                    const { data: fileList, error: listError } = await supabase
                                    .storage
                                    .from('picturesExtra') // The storage bucket name
                                    .list(notification.sender_id);

                    const publicUrls : string[] = fileList.map((file) =>
                                    supabase.storage.from('picturesExtra').getPublicUrl(`${notification.sender_id}/${file.name}`).data.publicUrl
                                );

                    const matchInfo : UserPopUp = {...match, publicUrls};
                    setCurrentMatch(matchInfo);
                    setOpenMatchPopup(true);
                }

                if (matchInfoError) {
                    console.error("Error marking notification as read:", matchInfoError.message);
                } else {
                    console.log("Notification marked as read");
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        }
    };

    return (
        <>
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
                <div className={`text-sm mx-2 overflow-hidden  ${
                    expanded ? "" : "hidden"
                }`}>
                    <span className="font-semibold">{senderName}</span>
                    <p>{notification.content}</p>
                </div>

            </div>
            <UserPopup currentMatch={currentMatch} isOpen={openMatchPopup}
                       onClose={() => setOpenMatchPopup(false)}></UserPopup>
        </>
    );
};

export default NotificationItem;
