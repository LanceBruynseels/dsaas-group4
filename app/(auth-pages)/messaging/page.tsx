'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mic, Send } from 'lucide-react';
import { useIsMobile } from "@/components/mediaQuery";
import Link from 'next/link';
const supabase = createClient();
import {useRouter, useSearchParams} from 'next/navigation';
import {getUserId} from "@components/UserDisplay";

const ChatApp: React.FC = () => {
    const [selectedContact, setSelectedContact] = useState<any | null>(null); // Holds the current selected contact
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {

        const matchedId = searchParams.get('matchedId');
        if (matchedId) {
            // Fetch contact details for the given matchId
            const fetchContact = async () => {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', matchedId)
                    .single();

                if (error) {
                    console.error('Error fetching contact:', error);
                } else {
                    setSelectedContact(data);
                }
            };

            fetchContact();
        }
    }, [searchParams]); // Re-run if query parameters change

    // Mark all messages from the selected contact as read when a chat is opened
    useEffect(() => {
        const markMessagesAsRead = async () => {
            if (selectedContact) {
                const { error } = await supabase
                    .from('message')
                    .update({ is_read: true }) // Set is_read to true
                    .eq('receiver', getUserId()) // Current user is the receiver
                    .eq('sender', selectedContact.id); // Messages from the selected contact

                if (error) {
                    console.error('Error marking messages as read:', error);
                }
            }
        };

        markMessagesAsRead();
    }, [selectedContact]); // Run this effect when selectedContact changes

    return <Suspense fallback={<div>Loading...</div>}>
        <Suspense fallback={<div>Loading search params...</div>}>
            {isMobile ? (
            <div className="flex h-screen bg-[hsl(10,100%,90%)]">
                <div className="max-w-fit p-10">
                    <Sidebar
                        onSelectContact={(contact) =>
                            router.push(`/mobile-messaging?id=${contact.id}`) // Pass contact ID via query params
                        }
                    />
                </div>
            </div>
        ) : (
            // Laptop version
            <div className="flex h-screen bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="w-1/3 p-6">
                    <Sidebar onSelectContact={setSelectedContact} />
                </div>
                <div className="w-2 bg-gradient-to-b from-[#FFAB9F] to-[#FFDFDB]"></div>
                <div className="flex-1 flex flex-col p-6">
                    {selectedContact ? (
                        <ChatSection selectedContact={selectedContact} /> // Render the chat section with the selected contact
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-lg text-gray-500">Select a contact for chatting</p>
                        </div>
                    )}
                </div>
            </div>
            )}
            </Suspense>
        </Suspense>
};

const Sidebar: React.FC<{ onSelectContact: (contact: any) => void }> = ({ onSelectContact }) => {
    const [matches, setMatches] = useState<any[]>([]); // Matched contacts
    const [profilePictures, setProfilePictures] = useState<{ [key: string]: string }>({}); // Profile pictures by user ID
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({}); // Unread message counts
    const isMobile = useIsMobile();
    const senderId = getUserId(); // Get current user ID

    // Fetch matched contacts
    useEffect(() => {
        const fetchMatches = async () => {
            const { data: matchData, error: matchError } = await supabase
                .from('Matches')
                .select('*')
                .or(`user_1.eq.${senderId},user_2.eq.${senderId}`);

            if (matchError) {
                console.error('Error fetching matches:', matchError);
                return;
            }

            if (matchData) {
                const matchedContacts = matchData.map((match) => {
                    return match.user_1 === senderId ? match.user_2 : match.user_1;
                });

                // Fetch user details for matched contacts
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, username')
                    .in('id', matchedContacts);

                if (userError) {
                    console.error('Error fetching user details:', userError);
                    return;
                }

                if (userData) {
                    setMatches(userData); // Save matched user data
                }
            }
        };

        fetchMatches();
    }, [senderId]);

    // Fetch unread message counts
    useEffect(() => {
        const fetchUnreadCounts = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('receiver, sender, is_read') // Fetch relevant fields
                .eq('is_read', false) // Filter for unread messages
                .eq('receiver', senderId); // Current user is the receiver

            if (error) {
                console.error('Error fetching unread messages:', error);
                return;
            }

            // Group and count unread messages
            const counts = data.reduce((acc, msg) => {
                if (!acc[msg.sender]) {
                    acc[msg.sender] = 0; // Initialize count for this sender
                }
                acc[msg.sender] += 1; // Increment count for this sender
                return acc;
            }, {});

            setUnreadCounts(counts); // Save the unread counts
        };

        fetchUnreadCounts();
    }, [senderId]);

    // Fetch profile pictures
    useEffect(() => {
        const fetchProfilePictures = async () => {
            const userIds = matches.map((match) => match.id); // Extract user IDs

            if (userIds.length > 0) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profile') // Query the profile table
                    .select('user_id, profile_picture_url')
                    .in('user_id', userIds); // Filter by matched user IDs

                if (profileError) {
                    console.error('Error fetching profile pictures:', profileError);
                    return;
                }

                if (profileData) {
                    // Build a dictionary of user_id to profile_picture_url
                    const pictures = profileData.reduce((acc, profile) => {
                        acc[profile.user_id] = profile.profile_picture_url;
                        return acc;
                    }, {});
                    setProfilePictures(pictures); // Save profile pictures
                }
            }
        };

        fetchProfilePictures();
    }, [matches]);

    return (
        <div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search conversations"
                    className="w-full p-3 rounded-lg border border-gray-300"
                />
            </div>
            <div className="space-y-5">
                {matches.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => onSelectContact(contact)}
                        className="p-3 bg-[hsl(10,100%,95%)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={profilePictures[contact.id] || 'https://via.placeholder.com/40'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <div
                                    className={`font-bold truncate ${
                                        unreadCounts[contact.id] ? 'text-red-500' : 'text-black'
                                    }`}
                                >
                                    {contact.username}
                                </div>
                                <div className="text-gray-500 text-sm truncate">
                                    {unreadCounts[contact.id]
                                        ? `Unread messages: ${unreadCounts[contact.id]}`
                                        : 'Start a conversation...'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};





const ChatSection: React.FC<{ selectedContact: any }> = ({ selectedContact }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const isMobile = useIsMobile();
    const senderId = getUserId(); // Current user ID
    const receiverId = selectedContact.id; // Selected contact's ID
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Mark all messages from the selected contact as read
    const markMessagesAsRead = async () => {
        try {
            const { error } = await supabase
                .from('message')
                .update({ is_read: true }) // Update `is_read` to true
                .or(
                    `and(sender.eq.${receiverId},receiver.eq.${senderId})`
                ); // Only update messages sent by the contact to the current user

            if (error) {
                console.error('Error marking messages as read:', error);
            } else {
                console.log('Messages marked as read for conversation with', receiverId);
            }
        } catch (err) {
            console.error('Unexpected error marking messages as read:', err);
        }
    };

    // Fetch messages and mark them as read
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from('message')
                    .select('*')
                    .or(
                        `and(sender.eq.${senderId},receiver.eq.${receiverId}),and(sender.eq.${receiverId},receiver.eq.${senderId})`
                    );

                if (error) {
                    console.error('Error fetching messages:', error);
                    return;
                }

                if (data) {
                    setMessages(data); // Set fetched messages
                }
            } catch (err) {
                console.error('Unexpected error fetching messages:', err);
            }
        };

        fetchMessages();
        markMessagesAsRead(); // Mark messages as read when the chat opens
    }, [senderId, receiverId]);

    // Real-time listener for new messages
    useEffect(() => {
        const channel = supabase
            .channel('realtime:message')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'message',
                },
                (payload) => {
                    const newMessage = payload.new;

                    // Add the new message to the state
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            )
            .subscribe();

        // Cleanup the subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [senderId, receiverId]);

    // Scroll to the bottom of the chat whenever messages update
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return isMobile ? null : (
        <div>
            {/* Chat Header */}
            <ChatHeader selectedContact={selectedContact} />

            {/* Message Display Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto min-h-0 max-h-[60vh]"
            >
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} senderId={senderId} />
                ))}
            </div>

            {/* Message Input */}
            <MessageInput receiverId={receiverId} />
        </div>
    );
};




const ChatHeader: React.FC<{ selectedContact: any }> = ({ selectedContact }) => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        // Reset the profile picture when the selected contact changes
        setProfilePicture(null);

        const getProfilePicture = async () => {
            try {
                const { data, error } = await supabase
                    .from('profile')
                    .select('profile_picture_url')
                    .eq('user_id', selectedContact.id)
                    .single(); // Fetch a single row

                if (error) {
                    console.error('Error fetching profile picture:', error);
                    return;
                }

                if (data?.profile_picture_url) {
                    setProfilePicture(data.profile_picture_url); // Set the profile picture URL
                } else {
                    setProfilePicture(null); // Set to null if no picture found
                }
            } catch (err) {
                console.error('Unexpected error fetching profile picture:', err);
                setProfilePicture(null); // Reset on error
            }
        };

        getProfilePicture();
    }, [selectedContact]);

    return (
        <div className="flex items-center justify-between p-4 mb-6 bg-[hsl(10,100%,95%)] rounded-lg">
            <div className="flex items-center gap-3">
                <img
                    src={profilePicture || '/profile-picture.png'} // Use default if no profile picture
                    alt={`${selectedContact?.username || 'Unknown'}'s Profile`}
                    className="w-10 h-10 rounded-full"
                />
                <h3 className="text-lg font-bold">{selectedContact?.username || 'Unknown'}</h3>
            </div>
        </div>
    );
};


const ChatMessage: React.FC<{ message: any; senderId: string }> = ({ message, senderId }) => {
    // Destructure the message object to extract relevant fields
    const { mediaURL, time_stamp, sender } = message;
    const isMobile = useIsMobile();

    // Determine if the message was sent by the current user
    const isSentByCurrentUser = sender === senderId;

    // Check if the message contains an image by matching the file extension
    const isImage = mediaURL && ['.jpeg', '.jpg', '.gif', '.png'].some(ext => mediaURL.toLowerCase().endsWith(ext));

    // Check if the message contains an audio file by matching the file extension
    const isAudio = mediaURL && ['.wav', '.mp3', '.ogg'].some(ext => mediaURL.toLowerCase().endsWith(ext));

    // Check if the message contains a text file by matching the file extension
    const isText = mediaURL && mediaURL.endsWith('.txt');

    // State to store the content of the text file (if the message contains one)
    const [loadedText, setLoadedText] = useState<string | null>(null);

    // useEffect to fetch the text content if the message contains a text file
    useEffect(() => {
        const fetchTextContent = async () => {
            if (isText && mediaURL) {
                try {
                    // Fetch the content of the text file from the mediaURL
                    const response = await fetch(mediaURL);
                    if (response.ok) {
                        const text = await response.text();
                        setLoadedText(text); // Update the state with the text content
                    } else {
                        setLoadedText('Failed to fetch content.'); // Handle fetch failure
                    }
                } catch (error) {
                    // Log any errors that occur during the fetch
                    console.error('Error fetching text content:', error);
                    setLoadedText('Error loading content.');
                }
            }
        };

        fetchTextContent(); // Call the function to fetch the text content
    }, [mediaURL, isText]); // Dependencies: re-run if mediaURL or isText changes


    return isMobile ? null:(
        // Outer container for the message with alignment based on the sender
        <div className={`flex items-start ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} gap-3 mb-3`}>
            <div className="flex flex-col">
                {/* Display the timestamp of the message in a readable format */}
                <div className="text-xs text-gray-400">{new Date(time_stamp).toLocaleTimeString()}</div>

                {/* Conditional rendering based on the type of media in the message */}
                {isImage ? (
                    // Render an image if the message contains an image file
                    <img
                        src={mediaURL} // Use the mediaURL as the source of the image
                        alt="Media content"
                        className="w-40 h-40 object-cover rounded-lg"
                    />
                ) : isAudio ? (
                    // Render an audio player if the message contains an audio file
                    <div className={`p-3 rounded-lg ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <audio controls src={mediaURL} /> {/* Audio player */}
                    </div>
                ) : isText ? (
                    // Render the text content if the message contains a text file
                    <div className={`p-3 rounded-lg max-w-xs ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <p>{loadedText}</p> {/* Display the fetched text content */}
                    </div>
                ) : (

                    <div className={`p-3 rounded-lg max-w-xs ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <p>Content could not be loaded</p>
                    </div> // If there is some error
                )}
            </div>
        </div>
    );
};


const MessageInput: React.FC<{ receiverId: string }> = ({ receiverId }) => {
    const isMobile = useIsMobile();
    // State to manage the text content entered by the user
    const [textContent, setTextContent] = useState('');
    // State to store a file selected by the user (e.g., images)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // State to indicate whether audio recording is in progress
    const [isRecording, setIsRecording] = useState(false);
    // State to store the recorded audio as a Blob
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

    // References to manage media recording and streams
    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // MediaRecorder instance for audio recording
    const chunksRef = useRef<Blob[]>([]); // Buffer
    const streamRef = useRef<MediaStream | null>(null); // React reference to the audio

    // Hardcoded sender ID (current user)
    const senderId = getUserId();

    // Starts audio recording
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

    // Stops audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop(); // Stop the MediaRecorder
            setIsRecording(false); // Update recording state
        }
    };

    // Cleans up audio resources (stops streams and resets references)
    const cleanupMedia = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
            streamRef.current = null; // Reset the stream reference
        }
        mediaRecorderRef.current = null; // Reset MediaRecorder reference
        chunksRef.current = []; // Clear the audio chunks buffer
    };

    // Handles file input change (e.g., when the user selects an image)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file); // Store the selected file
            setTextContent(''); // Clear text input
            setRecordedAudio(null); // Clear recorded audio
        }
    };

    // Sends the message (text, file, or audio)
    const handleSend = async () => {

        let fileName: string;
        let contentToUpload: File | Blob;

        // Determine the type of content to upload
        if (recordedAudio) {
            // If there's recorded audio, prepare it for upload
            fileName = `voice/${Date.now()}-voice-message.wav`;
            contentToUpload = recordedAudio;
        } else if (selectedFile) {
            // If a file is selected, prepare it for upload
            fileName = `images/${Date.now()}-${selectedFile.name}`;
            contentToUpload = selectedFile;
        } else if (textContent.trim()) {
            // If text is entered, prepare it as a text file for upload
            fileName = `texts/${Date.now()}-message.txt`;
            contentToUpload = new Blob([textContent], { type: 'text/plain' });
        } else {
            // If no content is provided, show an alert
            alert('Please enter a message, select a file, or record audio.');
            return;
        }

        // Upload the content to the Supabase storage bucket
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('Messages')
            .upload(fileName, contentToUpload);


        // Generate a public URL for the uploaded content
        const { data: urlData } = supabase.storage.from('Messages').getPublicUrl(fileName);
        const publicURL = urlData?.publicUrl;

        if (!publicURL) {
            alert('Failed to get public URL for the uploaded content.');
            return;
        }

        // Insert the message into the database
        const { error: insertError } = await supabase
            .from('message')
            .insert([
                {
                    sender: senderId, // Current user
                    receiver: receiverId, // Recipient
                    mediaURL: publicURL, // Uploaded content's URL
                    time_stamp: new Date(), // Timestamp of the message
                    is_read: false // Mark as unread
                }
            ]);


        // Clear input fields after successful send
        setTextContent('');
        setSelectedFile(null);
        setRecordedAudio(null);


    };


    return isMobile ? null:(
        <div className="mt-auto flex items-center p-4 bg-white rounded-lg gap-2">
            {/* Text input for the message */}
            <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg border border-gray-300 outline-none resize-none"
                disabled={isRecording || !!selectedFile || !!recordedAudio} // Disable if recording or file is selected
            />
            {/* File input for selecting an image */}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="ml-2"
                disabled={isRecording || !!textContent.trim() || !!recordedAudio} // Disable if recording or text entered
            />
            {/* Recording buttons */}
            {!recordedAudio ? (
                <>
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
                </>
            ) : (
                // Indicate that a recording is ready to send
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Recording ready to send</span>
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