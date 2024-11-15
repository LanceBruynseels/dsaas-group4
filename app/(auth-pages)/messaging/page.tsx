'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const contacts = [
    { name: 'Bonnie Green', message: "That's awesome. I think our users..." },
    { name: 'Alice Wong', message: "That's awesome. I think our users..." },
    { name: 'John Doe', message: "That's awesome. I think our users..." },
    { name: 'Sofie Janssens', message: "That's awesome. I think our users..." },
    { name: 'Emma Wilson', message: "That's awesome. I think our users..." },
    { name: 'Roger Peeters', message: "That's awesome. I think our users..." },
    { name: 'Koen De Bast', message: "That's awesome. I think our users..." },
];

const ChatApp: React.FC = () => {
    return (
        <div className="flex h-screen bg-[hsl(10,100%,90%)]">
            <div className="w-1/3 p-6">
                <Sidebar />
            </div>
            <div className="w-6 bg-[hsl(10,100%,95%)]"></div>
            <div className="flex-1 flex flex-col p-6">
                <ChatSection />
            </div>
        </div>
    );
};

const Sidebar: React.FC = () => {
    return (
        <>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="zoek een gesprek"
                    className="w-full p-3 rounded-lg border border-gray-300"
                />
            </div>
            <div className="space-y-5">
                {contacts.map((contact, index) => (
                    <div
                        key={index}
                        className="p-3 bg-[hsl(10,100%,95%)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{contact.name}</div>
                                <div className="text-gray-500 text-sm truncate">
                                    {contact.message}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

const ChatSection: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b'; // Your sender ID
    const receiverId = '9ba9d983-1b17-49e2-9cc0-9dcd5bd0c9ba'; // Your receiver ID

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('*')
                .or(`and(sender.eq.${senderId},receiver.eq.${receiverId}),and(sender.eq.${receiverId},receiver.eq.${senderId})`)

            if (error) {
                console.error('Failed to fetch messages:', error.message);
            } else {
                setMessages(data || []);
            }
        };

        fetchMessages();
    }, []);

    return (
        <>
            <ChatHeader />
            <div className="flex-1 overflow-y-auto min-h-0">
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} senderId={senderId} />
                ))}
            </div>
            <MessageInput />
        </>
    );
};


const ChatHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between p-4 mb-6 bg-[hsl(10,100%,95%)] rounded-lg">
            <div className="flex items-center gap-3">
                <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
                <h3 className="text-lg font-bold">Bonnie Green</h3>
            </div>
        </div>
    );
};

const ChatMessage: React.FC<{ message: any, senderId: string }> = ({ message, senderId }) => {
    const { mediaURL, time_stamp, sender } = message;
    const [textContent, setTextContent] = useState<string | null>(null);
    const isSentByCurrentUser = sender === senderId;

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
                            setTextContent(mediaURL); // Use the URL directly for images
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

    return (
        <div className={`flex items-start ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} gap-3 mb-3`}>
            <div className="flex flex-col">
                <div className="text-xs text-gray-400">{new Date(time_stamp).toLocaleTimeString()}</div>
                {isImage ? (
                    <img
                        src={textContent || mediaURL}
                        alt="Media content"
                        className="w-40 h-40 object-cover rounded-lg"
                    />
                ) : (
                    <div
                        className={`p-3 rounded-lg max-w-xs ${isSentByCurrentUser ? 'bg-blue-100' : 'bg-gray-200'}`}
                    >
                        <p>{textContent || 'Content could not be loaded'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};



const MessageInput: React.FC = () => {
    const [textContent, setTextContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const senderId = '42a20f25-a201-4706-b8a3-2c4fafa58f4b'; // Your sender ID
    const receiverId = '9ba9d983-1b17-49e2-9cc0-9dcd5bd0c9ba'; // Your receiver ID

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setTextContent(''); // Clear text input if a file is selected
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
                .from('message')
                .insert([
                    {
                        sender: senderId,
                        receiver: receiverId,
                        mediaURL: publicURL,
                        time_stamp: new Date(),
                        is_read: false
                    }
                ]);

            if (insertError) {
                console.error('Failed to insert message into database:', insertError.message);
                alert(`Failed to save message: ${insertError.message}`);
                return;
            }

            alert('Message saved to database successfully!');
            setTextContent('');
            setSelectedFile(null);
        } catch (e) {
            console.error('An unexpected error occurred:', e);
            alert('An unexpected error occurred during upload.');
        }
    };

    return (
        <div className="mt-auto flex items-center p-4 bg-white rounded-lg">
            <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg border border-gray-300 outline-none"
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
                className="ml-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors"
            >
                &#128172;
            </button>
        </div>
    );
};


export default ChatApp;
