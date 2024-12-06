'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {useIsMobile} from "@components/mediaQuery";

const supabase = createClient();

const ChatApp: React.FC = () => {
    const [selectedGroupChat, setSelectedGroupChat] = useState<any | null>(null);
    const searchParams = useSearchParams();
    const chatID = searchParams.get('chatId');
    const isMobile = useIsMobile();
    useEffect(() => {
        if (chatID) {
            const fetchChat = async () => {
                const { data, error } = await supabase
                    .from('discover_chats')
                    .select('*')
                    .eq('id', chatID)
                    .single();

                if (error) {
                    console.error('Failed to fetch chat:', error);
                } else {
                    setSelectedGroupChat(data);  // Set the selected chat from the database
                }
            };

            fetchChat();
        }
    }, [chatID]);


    return (
        <div className="flex flex-col h-screen bg-[hsl(10,100%,90%)] p-4 md:p-6">
            <div className="flex-1 flex flex-col">
                {selectedGroupChat ? (
                    <ChatSection selectedGroupChat={selectedGroupChat} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-gray-500">Loading chat... </p>
                    </div>
                )}
            </div>
        </div>
    );

};


const ChatSection: React.FC<{ selectedGroupChat: any }> = ({ selectedGroupChat }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';
    //const receiverId = selectedContact.id;
    const receiverId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';


    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('group_message') // Assuming the table is named 'group_message'
                .select('*')
                .eq('group_id', selectedGroupChat.id); // Filter by the selected group ID

            if (error) {
                console.error('Error fetching messages:', error);
            } else if (data) {
                setMessages(data);
            }
        };


        fetchMessages();

        const channel = supabase
            .channel('realtime:group_message')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'group_message',
            }, (payload) => {
                const newMessage = payload.new;
                if (
                    (newMessage.sender === senderId && newMessage.group_id === selectedGroupChat.id) ||
                    (newMessage.sender === selectedGroupChat.id && newMessage.group_id === senderId)
                ) {
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            })
            .subscribe();


        return () => {
            supabase.removeChannel(channel);
        };
    }, [senderId, selectedGroupChat.id]);

    return (
        <>
            <ChatHeader selectedGroupChat={selectedGroupChat} />
            <div className="flex-1 overflow-y-auto min-h-0 p-2 md:p-4 bg-[hsl(10,100%,95%)] rounded-lg mb-4">
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} senderId={senderId} />
                ))}
            </div>
            <MessageInput receiverId={receiverId} selectedGroupChat={selectedGroupChat} />
        </>
    );

};

const ChatHeader: React.FC<{ selectedGroupChat: { id: number; title: string; image_url: string } }> = ({ selectedGroupChat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [problemDescription, setProblemDescription] = useState('');
    const [people, setPeople] = useState<{ username: string; user_id: number; isSelected: boolean }[]>([]);

    useEffect(() => {
        const fetchGroupUsers = async () => {
            if (selectedGroupChat) {
                const { data: groupUsers, error: groupUsersError } = await supabase
                    .from('groupchat_users')
                    .select('user_id')
                    .eq('group_id', selectedGroupChat.id);

                if (groupUsersError) {
                    console.error('Error fetching group users:', groupUsersError);
                    return;
                }

                if (groupUsers) {
                    const userIds = groupUsers.map((user) => user.user_id);
                    const { data: users, error: usersError } = await supabase
                        .from('users')
                        .select('id, username')
                        .in('id', userIds);

                    if (usersError) {
                        console.error('Error fetching usernames:', usersError);
                    } else {
                        setPeople(users.map((user) => ({
                            username: user.username,
                            user_id: user.id,
                            isSelected: false,
                        })));
                    }
                }
            }
        };

        fetchGroupUsers();
    }, [selectedGroupChat]);

    const handleCheckboxChange = (user_id: number) => {
        setPeople(prevPeople =>
            prevPeople.map(user =>
                user.user_id === user_id
                    ? { ...user, isSelected: !user.isSelected }
                    : user
            )
        );
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProblemDescription(event.target.value);
    };

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleReportSubmit = async () => {
        // Filter selected users (including the reporter)
        const selectedUsers = people.filter(user => user.isSelected);

        if (selectedUsers.length === 0) {
            console.error("No users selected");
            return;
        }

        // Assuming the first selected user is the reporter
        const reporter = selectedUsers[0];  // This is the reporter

        try {
            // Insert one row for each selected user (reporter + selected users) in the reports table
            const insertPromises = selectedUsers.map(user =>
                supabase
                    .from('reports')
                    .insert({
                        description: problemDescription, // The problem description
                        user_id: user.user_id,            // The user ID for each selected user (reporter + targets)
                    })
            );

            // Wait for all insertions to finish
            await Promise.all(insertPromises);

            console.log("Report submitted successfully");
            // Reset the checkboxes and problem description after submission
            setPeople(prevPeople =>
                prevPeople.map(user => ({
                    ...user,
                    isSelected: false,  // Reset selected state
                }))
            );
            setProblemDescription(''); // Clear the problem description text field
            closeModal();  // Close the modal
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Close the modal
        setPeople(prevPeople =>
            prevPeople.map(user => ({
                ...user,
                isSelected: false,  // Uncheck all checkboxes
            }))
        );
        setProblemDescription(''); // Clear the problem description
    };
    return (
        <div>
            <div className="flex items-center justify-between p-4 mb-6 bg-[hsl(10,100%,95%)] rounded-lg w-10/12">
                <div className="flex items-center gap-3">
                    <img
                        src={selectedGroupChat.image_url || "https://via.placeholder.com/40"}
                        alt={selectedGroupChat.title}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="text-lg font-bold">{selectedGroupChat.title}</h3>
                </div>

                <button
                    onClick={handleButtonClick}
                    className="ml-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                    🚩 Probleem melden
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold">Probleem melden</h2>
                        <p>Heb je een probleem dat je wil melden?</p>

                        <textarea
                            value={problemDescription}
                            onChange={handleTextChange}
                            rows={4}
                            className="mt-4 w-full p-2 border rounded-md"
                            placeholder="Beschrijf hier het probleem..."
                        />

                        <div className="mt-4 max-h-40 overflow-y-auto">
                            <h3 className="font-semibold">Is er iemand betrokken?</h3>
                            <ul className="list-disc pl-5">
                                {people.length === 0 ? (
                                    <li className="text-gray-500">Geen personen om te selecteren...</li>
                                ) : (
                                    people.map((user, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={user.isSelected}
                                                onChange={() => handleCheckboxChange(user.user_id)}
                                                className="form-checkbox"
                                            />
                                            <span>{user.username}</span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Sluiten
                            </button>
                            <button
                                onClick={handleReportSubmit}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                            >
                                Melden
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const ChatMessage: React.FC<{ message: any, senderId: string }> = ({ message, senderId }) => {
    const { mediaURL, time_stamp, sender } = message;
    const [textContent, setTextContent] = useState<string | null>(null);
    const isSentByCurrentUser = sender === senderId;
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (mediaURL) {
                try {
                    const response = await fetch(mediaURL);
                    if (response.ok) {
                        const contentType = response.headers.get('Content-Type');

                        if (contentType?.startsWith('text/')) {
                            const text = await response.text();
                            setTextContent(text);
                        } else if (contentType?.startsWith('image/')) {
                            setTextContent(mediaURL);
                        } else {
                            setTextContent('Unsupported content type.');
                        }
                    } else {
                        console.error('Failed to fetch media content:', response.statusText);
                        setTextContent('Failed to fetch content.');
                    }
                } catch (error) {
                    console.error('Error fetching media content:', error);
                    setTextContent('Error loading content.');
                }
            }
        };

        fetchContent();
    }, [mediaURL]);

    const isImage = mediaURL && ['.jpeg', '.jpg', '.gif', '.png'].some(ext => mediaURL.endsWith(ext));

    const handleImageClick = (image: string) => {
        setSelectedImage(image);  // Set the selected image to show in modal
        setIsImageModalOpen(true);  // Open the modal
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);  // Close the modal
        setSelectedImage(null);  // Clear selected image
    };

    return (
        <div className={`flex items-start ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} gap-3 mb-3`}>
            <div className="flex flex-col">
                <div className="text-xs text-gray-400">Rohan</div>
                {isImage ? (
                    <img
                        src={textContent || mediaURL}
                        alt="Media content"
                        className="w-40 h-40 object-cover rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(textContent || mediaURL)}  // Add click handler
                    />
                ) : (
                    <div
                        className={`p-3 rounded-lg max-w-xs ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}
                    >
                        <p>{textContent || 'Sending...'}</p>
                    </div>
                )}
            </div>

            {/* Modal for enlarged image */}
            {isImageModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="relative bg-white p-4 rounded-lg">
                        <img
                            src={selectedImage}
                            alt="Enlarged Media"
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-2 right-2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full shadow-md z-50"
                        >
                            &times;
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};


const MessageInput: React.FC<{ receiverId: string; selectedGroupChat: any }> = ({ receiverId, selectedGroupChat }) =>  {
    const [textContent, setTextContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setTextContent('');
        }
    };

    const handleSend = async () => {
        try {
            let fileName: string;
            let contentToUpload: File | Blob;

            if (selectedFile) {
                fileName = `images/${Date.now()}-${selectedFile.name}`;
                contentToUpload = selectedFile;
            } else if (textContent.trim()) {
                fileName = `texts/${Date.now()}-message.txt`;
                contentToUpload = new Blob([textContent], { type: 'text/plain' });
            } else {
                alert('Please enter a message or select a file.');
                return;
            }

            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('Messages')
                .upload(fileName, contentToUpload);

            if (uploadError) {
                console.error('Upload failed:', uploadError.message);
                alert(`Upload failed: ${uploadError.message}`);
                return;
            }

            const { data: urlData } = supabase.storage.from('Messages').getPublicUrl(fileName);
            const publicURL = urlData?.publicUrl;

            if (!publicURL) {
                alert('Failed to get public URL for the uploaded content.');
                return;
            }

            const { error: insertError } = await supabase
                .from('group_message')
                .insert([
                    {
                        sender: senderId,
                        group_id: selectedGroupChat.id,
                        mediaURL: publicURL,
                        timestamp: new Date(),
                        is_read: false
                    }
                ]);

            if (insertError) {
                console.error('Failed to insert message into database:', insertError.message);
                alert(`Failed to save message: ${insertError.message}`);
                return;
            }

            setTextContent('');
            setSelectedFile(null);
        } catch (e) {
            console.error('An unexpected error occurred:', e);
            alert('An unexpected error occurred during upload.');
        }
    };

    return (
        <div className="flex items-center p-4 bg-white rounded-lg w-10/12">
            <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-5 w-1/2 p-2 rounded-lg border border-gray-300 outline-none"
                disabled={!!selectedFile}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="ml-4"
                disabled={!!textContent.trim()}
            />
            <button
                onClick={handleSend}
                className="ml-2  text-2xl text-gray-500 hover:text-gray-700 transition-colors "
            >
                &#128172;
            </button>
        </div>
    );
};

export default ChatApp;