'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const ChatApp: React.FC = () => {
    const [selectedGroupChat, setSelectedGroupChat] = useState<any | null>(null);
    const searchParams = useSearchParams();
    const chatID = searchParams.get('chatId');

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
        <div className="flex h-screen bg-[hsl(10,100%,90%)]">
            <div className="w-1/3 p-6">
                <Sidebar onSelectGroupChat={setSelectedGroupChat} />
            </div>
            <div className="w-6 bg-[hsl(10,100%,95%)]"></div>
            <div className="flex-1 flex flex-col p-6">
                {selectedGroupChat ? (
                    <ChatSection selectedGroupChat={selectedGroupChat} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-gray-500">Select a group to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Sidebar: React.FC<{ onSelectGroupChat: (chat: any) => void }> = ({ onSelectGroupChat }) => {
    const router = useRouter();  // Access the router
    const [chats, setChats] = useState<{ id: number; title: string; image_url: string }[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<{ id: number; title: string } | null>(null);  // Add selected chat state

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const {data, error} = await supabase
                    .from("discover_chats")
                    .select("id, title, image_url");

                if (error) throw error;

                setChats(data);
            } catch (err) {
                setError("Er is een fout opgetreden.");
                console.error(err);
            }
        };

        fetchGroups();
    }, []);

    // Filter chats based on the search term
    const filteredChats = chats?.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChatSelect = (chat: any) => {
        setSelectedChat(chat);  // Update selected chat state
        router.push(`/group-messaging?chatId=${chat.id}`);  // Change the URL with the selected chat ID
        onSelectGroupChat(chat);  // Update the selected chat state
    };

    return (
        <>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Zoek een groepsgesprek"
                    className="w-full p-3 rounded-lg border border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredChats && filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat)}
                            className={`p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                                selectedChat?.id === chat.id ? "bg-blue-100" : "bg-[hsl(10,100%,95%)]"
                            }`}  // Conditional styling for the selected chat
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={chat.image_url || "https://via.placeholder.com/40"}
                                    alt={chat.title}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold truncate">{chat.title}</div>
                                    <div className="text-gray-500 text-sm truncate">
                                        Klik om deel te nemen...
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <div>{chats ? "Geen resultaten gevonden." : "Loading chats..."}</div>
                )}
            </div>
        </>
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
            <div className="flex-1 overflow-y-auto min-h-0">
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} senderId={senderId} />
                ))}
            </div>
            <MessageInput receiverId={receiverId} selectedGroupChat={selectedGroupChat} />
        </>
    );
};

const ChatHeader: React.FC<{ selectedGroupChat: { id: number; title: string; image_url: string } }> = ({ selectedGroupChat }) => {
    // State to control the modal visibility and the text field input
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [problemDescription, setProblemDescription] = useState('');
    const [people, setPeople] = useState<string[]>([]); // State for people list (empty for now)

    useEffect(() => {
        const fetchGroupUsers = async () => {
            if (selectedGroupChat) {
                // First, get the user IDs from groupchat_users table
                const { data: groupUsers, error: groupUsersError } = await supabase
                    .from('groupchat_users')
                    .select('user_id')
                    .eq('group_id', selectedGroupChat.id);

                if (groupUsersError) {
                    console.error('Error fetching group users:', groupUsersError);
                    return;
                }

                // Now, get the usernames for those user_ids
                if (groupUsers) {
                    const userIds = groupUsers.map((user) => user.user_id);
                    const { data: users, error: usersError } = await supabase
                        .from('users')
                        .select('username')
                        .in('id', userIds); // Query usernames based on the user IDs

                    if (usersError) {
                        console.error('Error fetching usernames:', usersError);
                    } else {
                        // Map the result to get the usernames
                        setPeople(users.map((user) => user.username));
                    }
                }
            }
        };

        fetchGroupUsers();
    }, [selectedGroupChat]); // Run when the selected group chat changes

    // Function to handle text input change
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProblemDescription(event.target.value);
    };

    // Function to open the modal
    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle report submission
    const handleReportSubmit = () => {
        console.log("Reported issue:", problemDescription);
        console.log("People involved:", people); // Logging the people list for now
        closeModal(); // Close modal after submission
    };

    return (
        <div>
            <div className="flex items-center justify-between p-4 mb-6 bg-[hsl(10,100%,95%)] rounded-lg">
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

                        {/* Text field for problem description */}
                        <textarea
                            value={problemDescription}
                            onChange={handleTextChange}
                            rows={4}
                            className="mt-4 w-full p-2 border rounded-md"
                            placeholder="Beschrijf hier het probleem..."
                        />

                        {/* List of people */}
                        <div className="mt-4 max-h-40 overflow-y-auto">
                            <h3 className="font-semibold">Betrokken personen:</h3>
                            <ul className="list-disc pl-5">
                                {people.length === 0 ? (
                                    <li className="text-gray-500">Geen personen geselecteerd</li>
                                ) : (
                                    people.map((userId, index) => (
                                        <li key={index}>{userId}</li>  // Displaying user IDs here, modify as needed
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Close and Melden buttons */}
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
        <div className="     flex items-center p-4 bg-white rounded-lg">
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
                className="ml-2  text-2xl text-gray-500 hover:text-gray-700 transition-colors"
            >
                &#128172;
            </button>
        </div>
    );
};

export default ChatApp;