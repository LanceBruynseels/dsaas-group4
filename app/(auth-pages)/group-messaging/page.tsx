'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Mic, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getUserId } from "@components/UserDisplay";
import { Spinner } from 'flowbite-react';

const supabase = createClient();

const ChatApp: React.FC = () => {
    const [selectedGroupChat, setSelectedGroupChat] = useState<any | null>(null);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatContent
                selectedGroupChat={selectedGroupChat}
                setSelectedGroupChat={setSelectedGroupChat}
            />
        </Suspense>
    );
};

const ChatContent: React.FC<{
    selectedGroupChat: any | null;
    setSelectedGroupChat: (chat: any | null) => void;
}> = ({ selectedGroupChat, setSelectedGroupChat }) => {
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

                } else {
                    setSelectedGroupChat(data);
                }
            };

            fetchChat();
        }
    }, [chatID, setSelectedGroupChat]);

    return (
        <div className="bg-white">
            <div className="flex h-[90vh] bg-gradient-to-b from-[#FFAB9F] to-[#FFDFDB]">
                <div className="w-1/3 p-6 rounded-tl-lg">
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
        </div>
    );
};

const Sidebar: React.FC<{ onSelectGroupChat: (chat: any) => void }> = ({ onSelectGroupChat }) => {
    const router = useRouter();
    const [chats, setChats] = useState<{ id: number; title: string; image_url: string }[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<{ id: number; title: string } | null>(null);
    const userId = getUserId();

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const { data, error } = await supabase
                    .from("groupchat_users")
                    .select("group_id")
                    .eq("user_id", userId);

                if (error) throw error;

                const groupIds = data.map((group) => group.group_id);

                if (groupIds.length > 0) {
                    const { data: chatsData, error: chatsError } = await supabase
                        .from("discover_chats")
                        .select("id, title, image_url")
                        .in("id", groupIds);

                    if (chatsError) throw chatsError;

                    setChats(chatsData);
                } else {
                    setChats([]);
                }
            } catch (err) {
            }
        };

        fetchUserGroups();
    }, [userId]);

    const filteredChats = chats?.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChatSelect = (chat: any) => {
        setSelectedChat(chat);
        router.push(`/group-messaging?chatId=${chat.id}`);
        onSelectGroupChat(chat);
    };

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Zoek een groepsgesprek"
                    className="w-full p-3 rounded-lg border border-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <button
                    className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => router.push("/discover")}
                >
                    Nieuwe groepschat
                </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredChats && filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat)}
                            className={`p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                                selectedChat?.id === chat.id ? "bg-blue-100" : "bg-[hsl(10,100%,95%)]"
                            }`}
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
                                        Klik om te chatten...
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <div className="flex justify-center items-center h-16">
                        <Spinner aria-label="Loading chats" size="lg" />
                    </div>
                )}
            </div>
        </>
    );
};


const ChatSection: React.FC<{ selectedGroupChat: any }> = ({ selectedGroupChat }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const senderId = getUserId();
    const receiverId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('group_message')
                .select('*')
                .eq('group_id', selectedGroupChat.id);  // Fetch messages for the selected group chat

            if (error) {
                console.error('Error fetching messages:', error);
            } else if (data) {
                setMessages(data);  // Update the state with fetched messages
            }
        };

        // Initial fetch of messages
        fetchMessages();

        const channel = supabase
            .channel('realtime:group_message')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'group_message',
                },
                (payload) => {
                    const newMessage = payload.new;
                    // Check if the new message belongs to the selected group chat
                    if (newMessage.group_id === selectedGroupChat.id) {
                        // Refetch the messages after a new message is inserted
                        fetchMessages();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);  // Cleanup the subscription on component unmount
        };
    }, [selectedGroupChat.id]);  // Re-run effect when the selected group changes


    // Chat component inside ChatSection
    const Chat = ({ selectedGroupChat, messages, senderId, receiverId }) => {
        return (
            <div className="flex flex-col h-screen">
                <ChatHeader selectedGroupChat={selectedGroupChat} />
                <div className="flex-1 overflow-y-auto min-h-0 max-h-[50vh]">
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} senderId={senderId} />
                    ))}
                </div>
                <div className="bg-white rounded-lg">
                    <MessageInput receiverId={receiverId} selectedGroupChat={selectedGroupChat} />
                </div>
            </div>
        );
    };

    return <Chat selectedGroupChat={selectedGroupChat} messages={messages} senderId={senderId} receiverId={receiverId} />;
};


const ChatHeader: React.FC<{ selectedGroupChat: { id: number; title: string; image_url: string } }> = ({ selectedGroupChat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [problemDescription, setProblemDescription] = useState('');
    const [people, setPeople] = useState<{ username: string; user_id: number; isSelected: boolean }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleReportSubmit = async () => {
        const selectedUsers = people.filter(user => user.isSelected);

        if (selectedUsers.length === 0) {
            console.error("No users selected");
            return;
        }

        try {
            const insertPromises = selectedUsers.map(user =>
                supabase
                    .from('reports')
                    .insert({
                        description: problemDescription,
                        user_id: user.user_id,
                        groupchat_id: selectedGroupChat.id,
                    })
            );

            await Promise.all(insertPromises);

            console.log("Report submitted successfully");
            closeModal();
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPeople(prevPeople =>
            prevPeople.map(user => ({
                ...user,
                isSelected: false,
            }))
        );
        setProblemDescription('');
        setSearchTerm('');
    };

    const filteredPeople = people.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    onClick={() => setIsModalOpen(true)}
                    className="ml-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                    🚩 Probleem melden
                </button>
            </div>

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

                        <div className="mt-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Zoek naar personen..."
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="mt-4">
                            <h3 className="font-semibold">Is er iemand betrokken?</h3>
                            <ul className="list-disc pl-5 space-y-2 max-h-40 overflow-y-auto">
                                {filteredPeople.slice(0, 5).map((user, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={user.isSelected}
                                            onChange={() => handleCheckboxChange(user.user_id)}
                                            className="form-checkbox"
                                        />
                                        <span>{user.username}</span>
                                    </li>
                                ))}
                                {filteredPeople.length > 5 && (
                                    <li className="text-gray-500 text-sm">
                                        Blader omhoog of omlaag voor meer gebruikers...
                                    </li>
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


const ChatMessage: React.FC<{ message: any; senderId: string }> = ({ message, senderId }) => {
    const { mediaURL, time_stamp, sender } = message;
    const [username, setUsername] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loadedText, setLoadedText] = useState<string | null>(null);

    const isSentByCurrentUser = sender === senderId;
    const isImage = mediaURL && ['.jpeg', '.jpg', '.gif', '.png'].some((ext) => mediaURL.toLowerCase().endsWith(ext));
    const isAudio = mediaURL && ['.wav', '.mp3', '.ogg'].some((ext) => mediaURL.toLowerCase().endsWith(ext));
    const isText = mediaURL && mediaURL.endsWith('.txt');

    // Fetch username using sender ID
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('username')
                    .eq('id', sender)
                    .single();

                if (error) {
                    console.error('Error fetching username:', error);
                    setUsername('Unknown'); // Fallback in case of error
                } else if (data) {
                    setUsername(data.username);
                }
            } catch (err) {
                console.error('Error:', err);
                setUsername('Unknown');
            }
        };

        fetchUsername();
    }, [sender]);

    // Fetch text content if the message contains a text file
    useEffect(() => {
        const fetchTextContent = async () => {
            if (isText && mediaURL) {
                try {
                    const response = await fetch(mediaURL);
                    if (response.ok) {
                        const text = await response.text();
                        setLoadedText(text);
                    } else {

                    }
                } catch (error) {
                    console.error('Error fetching text content:', error);
                    setLoadedText('Error loading content.');
                }
            }
        };

        fetchTextContent();
    }, [mediaURL, isText]);

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className={`flex items-start ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} gap-3 mb-3`}>
            <div className="flex flex-col">
                {/* Display the dynamically fetched username */}
                <div className="text-xs text-gray-400">{username || 'Loading...'}</div>
                {isImage ? (
                    <img
                        src={textContent || mediaURL}
                        alt="Media content"
                        className="w-40 h-40 object-cover rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(textContent || mediaURL)}
                    />
                ) : isAudio ? (
                    <div className={`p-3 rounded-lg ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <audio controls src={mediaURL} />
                    </div>
                ) : isText ? (
                    <div className={`p-3 rounded-lg max-w-xs ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <p>{loadedText}</p>
                    </div>
                ) : (
                    <div className={`p-3 rounded-lg max-w-xs ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <p>{textContent || 'loading...'}</p>
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
    const senderId = getUserId();
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // MediaRecorder instance for audio recording
    const chunksRef = useRef<Blob[]>([]); // Buffer
    const streamRef = useRef<MediaStream | null>(null); // React reference to the audio

    const startRecording = async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Initialize MediaRecorder with the audio stream
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = []; // Buffer is empty now

            // Collect the chunks and add to the chunksRef
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // Finalize and store the recorded audio when recording stops
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                setRecordedAudio(audioBlob);
                cleanupMedia(); // Clean up resources
            };

            mediaRecorder.start(); // Start recording
            setIsRecording(true); // Update recording state
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Failed to start recording. Please ensure microphone permissions are granted.');
            cleanupMedia(); // Clean up resources on failure
            setIsRecording(false);
        }
    };

    const cleanupMedia = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
            streamRef.current = null; // Reset the stream reference
        }
        mediaRecorderRef.current = null; // Reset MediaRecorder reference
        chunksRef.current = []; // Clear the audio chunks buffer
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop(); // Stop the MediaRecorder
            setIsRecording(false); // Update recording state
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setTextContent('');
        }
    };

    const handleSend = async () => {
        try {
            let fileName;
            let contentToUpload;

            // Determine content type for upload
            if (recordedAudio) {
                fileName = `voice/${Date.now()}-voice-message.wav`;
                contentToUpload = recordedAudio;
            } else if (selectedFile) {
                fileName = `images/${Date.now()}-${selectedFile.name}`;
                contentToUpload = selectedFile;
            } else if (textContent.trim()) {
                fileName = `texts/${Date.now()}-message.txt`;
                contentToUpload = new Blob([textContent], { type: 'text/plain' });
            } else {
                alert('Please enter a message, select a file, or record audio.');
                return;
            }

            // Upload content to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('Messages')
                .upload(fileName, contentToUpload);

            if (uploadError) {
                console.error('Upload failed:', uploadError.message);
                alert(`Upload failed: ${uploadError.message}`);
                return;
            }

            // Get public URL of uploaded content
            const { data: urlData } = supabase.storage.from('Messages').getPublicUrl(fileName);
            const publicURL = urlData?.publicUrl;

            if (!publicURL) {
                alert('Failed to get public URL for the uploaded content.');
                return;
            }

            // Insert the message into the group_message table
            const { error: insertError } = await supabase
                .from('group_message')
                .insert([
                    {
                        sender: senderId,//senderId
                        group_id: selectedGroupChat.id,
                        mediaURL: publicURL,
                        timestamp: new Date(),
                        is_read: false,
                    },
                ]);

            if (insertError) {
                console.error('Failed to insert message into database:', insertError.message);
                alert(`Failed to save message: ${insertError.message}`);
                return;
            }

            // Clear input fields
            setTextContent('');
            setSelectedFile(null);
            setRecordedAudio(null);
        } catch (e) {
            console.error('An unexpected error occurred:', e);
            alert('An unexpected error occurred during upload.');
        }
    };


    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-md gap-4">
            {/* Text input for the message */}
            <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                disabled={!!selectedFile || isRecording || !!recordedAudio}
            />

            {/* File input */}
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                    disabled={!!textContent.trim() || isRecording || !!recordedAudio}
                />
                <label
                    htmlFor="fileInput"
                    className={`cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 
                    transition-colors ${!!textContent.trim() || isRecording || !!recordedAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Upload 📷
                </label>
            </div>

            {/* Show image preview if an image is selected */}
            {selectedFile && selectedFile.type.startsWith('image') && (
                <div className="flex flex-col items-center gap-2 mt-2">
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="max-w-[150px] max-h-[150px] object-cover rounded-lg"
                    />
                    <span className="text-sm text-gray-500">{selectedFile.name}</span>
                    {/* Remove image button */}
                    <button
                        onClick={() => setSelectedFile(null)}
                        className="mt-2 px-4 py-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Verwijderen
                    </button>
                </div>
            )}

            {/* Show audio preview if audio is recorded */}
            {recordedAudio && (
                <div className="flex flex-col items-center gap-2 mt-2">
                    <audio controls className="max-w-[150px]">
                        <source src={URL.createObjectURL(recordedAudio)} />
                        Your browser does not support the audio element.
                    </audio>
                    <span className="text-sm text-gray-500">Voice message</span>
                    {/* Remove audio button */}
                    <button
                        onClick={() => setRecordedAudio(null)}
                        className="mt-2 px-4 py-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Verwijderen
                    </button>
                </div>
            )}

            {/* Recording controls */}
            {!recordedAudio ? (
                <div className="flex items-center gap-2">
                    <button
                        onClick={startRecording}
                        className={`px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors 
                        ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isRecording}
                    >
                        🎙️ Start
                    </button>
                    <button
                        onClick={stopRecording}
                        className={`px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors 
                        ${!isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isRecording}
                    >
                        🎙️ Stop
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Recording ready</span>
                </div>
            )}

            {/* Send button */}
            <button
                onClick={handleSend}
                className={`flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 text-white text-xl hover:bg-blue-600 
                transition-colors ${(!textContent && !selectedFile && !recordedAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!textContent && !selectedFile && !recordedAudio}
            >
                &#10148; {/* Send icon */}
            </button>
        </div>
    );

};

export default ChatApp;