'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NotificationItem, { Notification_user } from '@components/notification';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUserId } from '@components/UserDisplay';

const supabase = createClientComponentClient();

interface NotificationProps {
    notifications_data: any;
}

export default function NotificationsPanel({ notifications_data }: NotificationProps) {
    const [expanded, setExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState<Notification_user[]>([]);

    const currentUserId = getUserId(); // Assuming this fetches the current user's ID.

    // Fetch unread messages from the database
    useEffect(() => {
        const fetchUnreadMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from('message')
                    .select('*')
                    .eq('receiver', currentUserId)
                    .eq('is_read', false);

                if (error) {
                    console.error('Error fetching unread messages:', error);
                    return;
                }

                if (data && data.length > 0) {
                    const newNotifications = data.map((msg) => ({
                        notification_id: msg.id,
                        user_id: msg.receiver,
                        type: 'message',
                        is_read: false,
                        notification_timestamp: msg.time_stamp,
                        content: 'You have unread messages.',
                        first_name_sender: 'Surprise',
                        last_name_sender: ' ',
                        sender_profile_image: null,
                        sender_id: msg.sender,
                    }));
                    setUnreadMessages(newNotifications);
                }
            } catch (err) {
                console.error('Unexpected error fetching unread messages:', err);
            }
        };

        fetchUnreadMessages();
    }, [currentUserId]);

    // Listen for screen size changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches);
        };

        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    return (
        <>
            {isMobile ? (
                <div
                    className={`absolute ${
                        expanded
                            ? 'top-[100px] w-auto h-full p-4 rounded-lg z-20 left-4 right-4 mb-4'
                            : 'left-5 top-[100px] w-12 h-12 cursor-pointer rounded-lg z-10'
                    } bg-red-50 transition-all`}
                >
                    {expanded ? (
                        <div>
                            <div
                                className={`flex flex-row justify-between items-center ${
                                    expanded ? 'p-4' : 'px-1 py-4'
                                }`}
                            >
                                <h2
                                    className={`text-xl font-bold overflow-hidden ${
                                        expanded ? 'w-32' : 'w-0'
                                    }`}
                                >
                                    Meldingen
                                </h2>
                                <div>
                                    <button onClick={() => setExpanded((curr) => !curr)}>
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18 17.94 6M18 18 6.06 6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {notifications_data.data && notifications_data.data.length > 0 ? (
                                notifications_data.data.map((notification: Notification_user) => (
                                    <NotificationItem
                                        key={notification.notification_id}
                                        notification={notification}
                                        expanded={expanded}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-semibold text-red-800 mb-2">
                                        No Notifications
                                    </h2>
                                </div>
                            )}
                            {/* Render unread messages as notifications */}
                            {unreadMessages.map((notification: Notification_user) => (
                                <NotificationItem
                                    key={`unread-${notification.notification_id}`}
                                    notification={notification}
                                    expanded={expanded}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="flex items-center justify-center h-full"
                            onClick={() => setExpanded((curr) => !curr)}
                        >
                            <Image src="/bell.png" alt="Bell Icon" height={25} width={25} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-row align-middle basis-1/2">
                    <div
                        className={`flex shadow-md flex-col rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] transition-all ${
                            expanded ? 'w-full m-4 p-4' : 'w-10 m-4 cursor-pointer'
                        }`}
                    >
                        <div
                            className={`flex flex-row justify-between items-center ${
                                expanded ? 'p-4' : 'px-1 py-4'
                            }`}
                        >
                            <h2
                                className={`text-xl font-bold overflow-hidden ${
                                    expanded ? 'w-32' : 'w-0'
                                }`}
                            >
                                Meldingen
                            </h2>
                            <div>
                                <Image src="/bell.png" alt="Bell Icon" height={25} width={25} />
                            </div>
                        </div>
                        <div className="flex flex-col my-2 h-full overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-red-950 scrollbar-track-red-50 h-32">
                            {notifications_data.data && notifications_data.data.length > 0 ? (
                                notifications_data.data.map((notification: Notification_user) => (
                                    <NotificationItem
                                        key={notification.notification_id}
                                        notification={notification}
                                        expanded={expanded}
                                    />
                                ))
                            ) : (
                                <div className={`flex flex-col items-center justify-center w-full h-full ${expanded ? '' : 'hidden'}`}>
                                    <h2 className="text-2xl font-semibold text-red-800 mb-2">
                                        No Notifications
                                    </h2>
                                </div>
                            )}
                            {/* Render unread messages as notifications */}
                            {unreadMessages.map((notification: Notification_user) => (
                                <NotificationItem
                                    key={`unread-${notification.notification_id}`}
                                    notification={notification}
                                    expanded={expanded}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        className={`flex flex-row items-center ${expanded ? '' : 'w-full'}`}
                    >
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
