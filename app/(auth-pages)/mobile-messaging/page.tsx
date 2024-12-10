'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, Send } from 'lucide-react';
import TextContent from "@components/TextContent";
import {getUserId} from "@components/UserDisplay";

const supabase = createClient();

const MobileMessaging: React.FC = () => {
    const searchParams = useSearchParams(); // Fetch query parameters
    const contactId = searchParams.get('id'); // Selected contact ID from query params
    const [contact, setContact] = useState<any | null>(null); // Contact details
    const [messages, setMessages] = useState<any[]>([]); // Chat messages
    const senderId = getUserId();
    const router = useRouter();

    // Fetch contact details using the contactId
    useEffect(() => {
        if (!contactId) return;

        const fetchContact = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('id, username')
                .eq('id', contactId)
                .single();

            if (error) {
                console.error('Error fetching contact details:', error);
            } else {
                setContact(data);
            }
        };

        fetchContact();
    }, [contactId]);

    // Fetch messages between the sender and the selected contact
    useEffect(() => {
        if (!contactId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('*')
                .or(
                    `and(sender.eq.${senderId},receiver.eq.${contactId}),and(sender.eq.${contactId},receiver.eq.${senderId})`
                )
                .order('time_stamp', { ascending: true }); // Order messages by timestamp

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
        };

        fetchMessages();

        // Realtime subscription to new messages
        const channel = supabase
            .channel('realtime:message')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'message' },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel); // Cleanup subscription
        };
    }, [contactId, senderId]);

    return (
        <div className="flex flex-col h-screen" style={{backgroundColor: '#FFEBEB'}}>
            {contact ? (
                <>
                    <ChatHeader contact={contact} onBack={() => router.push('/messaging')}/>
                    <ChatSection messages={messages} senderId={senderId}/>
                    <MessageInput receiverId={contact.id}/>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p>Loading chat...</p>
                </div>
            )}
        </div>
    );
};

export default MobileMessaging;

const ChatHeader: React.FC<{ contact: any; onBack: () => void }> = ({contact, onBack}) => (
    <div className="p-4" style={{backgroundColor: '#FFE0E0', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'}}>
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-sm text-gray-700 p-2 rounded-lg bg-white shadow-md">
                Back
            </button>
            <h2 className="text-lg font-semibold text-gray-800">{contact.username}</h2>
        </div>
    </div>
);

const ChatSection: React.FC<{ messages: any[]; senderId: string }> = ({ messages, senderId }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => {
                const isAudio = message.mediaURL.match(/\.(wav|mp3|ogg)$/i);
                const isSentByCurrentUser = message.sender === senderId;

                return (
                    <div
                        key={index}
                        className={`p-3 rounded-lg w-fit max-w-[75%] ${isSentByCurrentUser ? 'ml-auto' : 'mr-auto'}`}
                        style={{
                            backgroundColor: isSentByCurrentUser ? '#DCEEFF' : '#FFF5F5',
                            textAlign: isSentByCurrentUser ? 'right' : 'left',
                            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {isAudio ? (
                            // Render an audio player if the message contains an audio file
                            <div className={`p-3 rounded-lg ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                <audio controls src={message.mediaURL} className="w-48 h-8" /> {/* Audio player */}
                            </div>
                        ) : message.mediaURL.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img
                                src={message.mediaURL}
                                alt="Media"
                                className="w-full max-w-xs h-auto object-cover rounded-lg"
                            />
                        ) : message.mediaURL.match(/\.(txt)$/i) ? (
                            <TextContent url={message.mediaURL} />
                        ) : (
                            <a href={message.mediaURL} target="_blank" rel="noopener noreferrer">
                                Download File
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
};





/* Enhanced MessageInput from the provided code */
const MessageInput: React.FC<{ receiverId: string }> = ({ receiverId }) => {
    const [textContent, setTextContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const senderId = getUserId();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                setRecordedAudio(audioBlob);
                cleanupMedia();
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Failed to start recording. Please ensure microphone permissions are granted.');
            cleanupMedia();
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const cleanupMedia = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        chunksRef.current = [];
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setTextContent('');
            setRecordedAudio(null);
        }
    };


    const handleSend = async () => {
        let fileName: string;
        let contentToUpload: File | Blob;
        let mimeType: string;

        if (recordedAudio) {
            fileName = `voice/${Date.now()}-voice-message.wav`;
            contentToUpload = recordedAudio;
            mimeType = 'audio/wav';
        } else if (selectedFile) {
            fileName = `images/${Date.now()}-${selectedFile.name}`;
            contentToUpload = selectedFile;
            mimeType = selectedFile.type; // Use the original file type to retain properties
        } else if (textContent.trim()) {
            fileName = `texts/${Date.now()}-message.txt`;
            contentToUpload = new Blob([textContent], { type: 'text/plain' });
            mimeType = 'text/plain';
        } else {
            alert('Please enter a message, select a file, or record audio.');
            return;
        }

        try {
            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('Messages')
                .upload(fileName, contentToUpload, {
                    contentType: mimeType, // Specify MIME type to retain correct properties
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                alert('Failed to upload the content.');
                return;
            }

            // Get public URL for uploaded file
            const { data: urlData} = await supabase
                .storage
                .from('Messages')
                .getPublicUrl(fileName);


            const publicURL = urlData?.publicUrl;

            if (!publicURL) {
                alert('Could not generate a valid URL for the uploaded content.');
                return;
            }

            // Insert message into the database
            const { error: insertError } = await supabase
                .from('message')
                .insert([
                    {
                        sender: senderId,
                        receiver: receiverId,
                        mediaURL: publicURL,
                        time_stamp: new Date(),
                        is_read: false,
                    },
                ]);

            if (insertError) {
                console.error('Database Insert Error:', insertError);
            } else {
                setTextContent('');
                setSelectedFile(null);
                setRecordedAudio(null);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <div className="p-4 bg-white flex items-center gap-2 border-t" style={{ boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)' }}>
            <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg border border-gray-300 outline-none resize-none"
                disabled={isRecording || !!selectedFile || !!recordedAudio}
                rows={2}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="text-blue-600 p-2 cursor-pointer">
                📁
            </label>
            {!recordedAudio ? (
                isRecording ? (
                    <button onClick={stopRecording} className="p-2 text-white rounded-full" style={{ backgroundColor: '#FF6B6B' }}>
                        Stop Recording
                    </button>
                ) : (
                    <button onClick={startRecording} className="p-2 text-white rounded-full" style={{ backgroundColor: '#4CAF50' }}>
                        Start Recording
                    </button>
                )
            ) : (
                <span className="text-sm text-gray-500">Recording ready</span>
            )}
            <button onClick={handleSend} className="p-2 text-white rounded-full" style={{ backgroundColor: '#3498DB' }}>
                <Send />
            </button>
        </div>
    );
};

