'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mic, Send } from 'lucide-react';
const supabase = createClient();
import Image from "next/image";

const ChatApp: React.FC = () => {
    const [selectedContact, setSelectedContact] = useState<any | null>(null); // holds the current selected contact from the side bar

    return (
        <div className="flex h-screen bg-[hsl(10,100%,90%)]">
            <div className="w-1/3 p-6">
                <Sidebar onSelectContact={setSelectedContact} />
            </div>
            <div className="w-6 bg-[hsl(10,100%,95%)]"></div>
            <div className="flex-1 flex flex-col p-6">
                {selectedContact ? (
                    <ChatSection selectedContact={selectedContact} /> // renders the chat section with the selected contact if its not null
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-gray-500">Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Sidebar: React.FC<{ onSelectContact: (contact: any) => void }> = ({ onSelectContact }) => {
    // State to store the list of contacts fetched from the database
    const [matches, setMatches] = useState<any[]>([]);
    // Hardcoded ID representing the current user
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';

    // Effect to fetch matched contacts when the component mounts or when senderId changes
    useEffect(() => {
        // Asynchronous function to fetch matches and corresponding user details
        const fetchMatches = async () => {
            // Query the 'Matches' table to find rows where the current user is either user_1 or user_2
            const { data: matchData, error: matchError } = await supabase
                .from('Matches')
                .select('*')
                .or(`user_1.eq.${senderId},user_2.eq.${senderId}`);

            if (matchError) {
                // Log any error that occurs during the fetch
                console.error('Error fetching matches:', matchError);
            } else if (matchData) {
                // Extract the IDs of the contacts matched with the current user
                const matchedContacts = matchData.map((match: any) => {
                    return match.user_1 === senderId ? match.user_2 : match.user_1; // Identify the contact based on user_1 or user_2
                });

                // Fetch details (id and username) of the matched contacts from the 'users' table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, username')
                    .in('id', matchedContacts); // Filter users by IDs in matchedContacts

                if (userError) {
                    // Log any error that occurs while fetching user details
                    console.error('Error fetching user details:', userError);
                } else if (userData) {
                    // Update the state with the fetched user details
                    setMatches(userData); // userData will contain the username and id of the matched users
                }
            }
        };

        // Call the asynchronous fetch function
        fetchMatches();
    }, [senderId]); // Runs again if the senderID changes

    return (
        <>
            {/* Search bar for filtering conversations */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="zoek een gesprek" // Placeholder text in Dutch meaning "search a conversation"
                    className="w-full p-3 rounded-lg border border-gray-300" // Styling for the input field
                />
            </div>
            {/* List of matched contacts */}
            <div className="space-y-5">
                {matches.map((contact, index) => (
                    <div
                        key={index} // Unique key for each contact
                        onClick={() => onSelectContact(contact)} // Callback to select the contact when clicked
                        className="p-3 bg-[hsl(10,100%,95%)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            {/* Placeholder profile image */}
                            <Image
                                src="https://via.placeholder.com/40"
                                alt="Profile" // Alternative text for the image
                                width={10}
                                height={10}
                                className="rounded-full" // Styling for a circular profile picture
                            />
                            <div className="flex-1 min-w-0">
                                {/* Display the username of the contact */}
                                <div className="font-bold truncate">{contact.username}</div>
                                {/* Subtext under the username */}
                                <div className="text-gray-500 text-sm truncate">
                                    een gesprek beginnen ...
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


const ChatSection: React.FC<{ selectedContact: any }> = ({ selectedContact }) => {
    // State to store messages exchanged between the sender and the selected contact
    const [messages, setMessages] = useState<any[]>([]);

    // Hardcoded ID for the sender (current user)
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';

    // Extract the receiver's ID from the selected contact
    const receiverId = selectedContact.id;

    // useEffect to fetch messages and set up real-time updates
    useEffect(() => { // for managing external interactions
        // Function to fetch all messages between the sender and receiver from the database
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('message') // Query the 'message' table
                .select('*')     // Select all fields
                .or(             // Fetch messages where:
                    // Sender is the current user and receiver is the selected contact, OR vice versa
                    `and(sender.eq.${senderId},receiver.eq.${receiverId}),and(sender.eq.${receiverId},receiver.eq.${senderId})`
                );

            if (error) {
                // Log any errors during the fetch
                console.error('Error fetching messages:', error);
            } else if (data) {
                // Update the state with the fetched messages
                setMessages(data);
            }
        };

        // Call the function to fetch messages
        fetchMessages();

        // Set up a real-time listener for new messages
        const channel = supabase
            .channel('realtime:message') // Listen to the 'message' table for changes
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',       // Only listen for new message inserts
                    schema: 'public',      // Schema name
                    table: 'message',      // Table name
                },
                (payload) => {
                    // Handle the new message payload
                    const newMessage = payload.new;

                     {
                        // Add the new message to the existing state
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
                    }
                }
            )
            .subscribe(); // Subscribe to the real-time channel

        // Cleanup function to remove the real-time channel subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [senderId, receiverId]); // run this effect when senderId or receiverId changes

    return (
        <>
            {/* Render the chat header with selected contact's details */}
            <ChatHeader selectedContact={selectedContact} />

            {/* Message display area */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {messages.map((message, index) => (
                    // Render each message using the ChatMessage component
                    <ChatMessage key={index} message={message} senderId={senderId} />
                ))}
            </div>

            {/* Input area for sending new messages */}
            <MessageInput receiverId={receiverId} />
        </>
    );
};


const ChatHeader: React.FC<{ selectedContact: any }> = ({ selectedContact }) => {
    return (
        <div className="flex items-center justify-between p-4 mb-6 bg-[hsl(10,100%,95%)] rounded-lg">
            <div className="flex items-center gap-3">
                <Image
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    width={10}
                    height={10}
                    className="w-10 h-10 rounded-full"
                />
                <h3 className="text-lg font-bold">{selectedContact.username}</h3>
            </div>
        </div>
    );
};

const ChatMessage: React.FC<{ message: any; senderId: string }> = ({ message, senderId }) => {
    // Destructure the message object to extract relevant fields
    const { mediaURL, time_stamp, sender } = message;

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

    return (
        // Outer container for the message with alignment based on the sender
        <div className={`flex items-start ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} gap-3 mb-3`}>
            <div className="flex flex-col">
                {/* Display the timestamp of the message in a readable format */}
                <div className="text-xs text-gray-400">{new Date(time_stamp).toLocaleTimeString()}</div>

                {/* Conditional rendering based on the type of media in the message */}
                {isImage ? (
                    // Render an image if the message contains an image file
                    <Image
                        src={mediaURL} // Use the mediaURL as the source of the image
                        alt="Media content"
                        width={40}
                        height={40}
                        className="object-cover rounded-lg"
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
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b';

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

    return (
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
                        className="ml-2 p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
                        disabled={isRecording} // Disable if already recording
                    >
                        Start Recording
                    </button>
                    <button
                        onClick={stopRecording}
                        className="ml-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                        disabled={!isRecording} // Disable if not recording
                    >
                        Stop Recording
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
                className={`ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white
                          ${(!textContent && !selectedFile && !recordedAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!textContent && !selectedFile && !recordedAudio} // Disable if no content
            >
                <Send size={20} />
            </button>
        </div>
    );
};

export default ChatApp;
