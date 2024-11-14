import React from 'react';

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
        <div className="flex h-screen">
            <Sidebar />
            <ChatSection />
        </div>
    );
};

const Sidebar: React.FC = () => {
    return (
        <div className="w-1/3 bg-pink-100 p-4 overflow-y-auto">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="zoek een gesprek"
                    className="w-full p-2 rounded-lg border border-gray-300"
                />
            </div>
            <ul className="space-y-4"> {/* Increase spacing here */}
                {contacts.map((contact, index) => (
                    <li key={index} className="flex items-center p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer">
                        <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <div className="font-bold">{contact.name}</div>
                            <div className="text-gray-500 text-sm">{contact.message}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ChatSection: React.FC = () => {
    return (
        <div className="w-2/3 flex flex-col bg-pink-100 p-4">
            <ChatHeader />
            <div className="flex flex-col space-y-4 mb-4">
                <div className="bg-white p-3 rounded-lg shadow-md max-w-xs self-start">
                    That's awesome. I think our users will really appreciate the improvements.
                    <span className="block text-xs text-gray-400 mt-2">11:46</span>
                </div>
                <div className="bg-red-700 text-white p-3 rounded-lg shadow-md max-w-xs self-end">
                    That's awesome. I think our users will really appreciate the improvements.
                    <span className="block text-xs text-gray-300 mt-2">11:46</span>
                </div>
            </div>
            <MessageInput />
        </div>
    );
};

const ChatHeader: React.FC = () => {
    return (
        <div className="flex items-center mb-4">
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <h3 className="text-lg font-bold">Bonnie Green</h3>
        </div>
    );
};

const MessageInput: React.FC = () => {
    return (
        <div className="mt-auto flex items-center p-2 bg-white rounded-lg shadow-md">
            <input
                type="text"
                placeholder="Schrijf een bericht"
                className="flex-grow p-2 rounded-lg border border-gray-300 outline-none"
            />
            <button className="ml-2 text-2xl text-gray-500">&#128172;</button>
        </div>
    );
};

export default ChatApp;