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
        <div className="flex h-screen bg-[hsl(10,100%,90%)]">
            {/* left sidebar */}
            <div className="w-1/3 p-6">
                <Sidebar />
            </div>

            {/* divider */}
            <div className="w-6 bg-[hsl(10,100%,95%)]"></div>

            {/* chat block */}
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
                    <div key={index} className="p-3 bg-[hsl(10,100%,95%)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{contact.name}</div>
                                <div className="text-gray-500 text-sm truncate">{contact.message}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

const ChatSection: React.FC = () => {
    return (
        <>
            <ChatHeader />
            <div className="flex-1 overflow-y-auto min-h-0">

                {/*their msg*/}
                <div className="flex items-start gap-3">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                            <span className="font-semibold">Bonnie Green</span>
                            <span className="text-xs text-gray-400">11:46</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg max-w-sm">
                            That's awesome. I think our users will really appreciate the improvements.
                        </div>
                        <span className="text-xs text-gray-400">Delivered</span>
                    </div>
                </div>
                {/*their msg=================*/}

                {/*your msg*/}
                <div className="flex items-start justify-end gap-3">
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-400">11:46</span>
                            <span className="font-semibold">Bonnie Green</span>
                        </div>
                        <div className="bg-red-700 text-white p-4 rounded-lg max-w-sm">
                            That's awesome. I think our users will really appreciate the improvements.
                        </div>
                        <span className="text-xs text-gray-400">Delivered</span>
                    </div>
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
                {/*your msg=================*/}
            </div>
            <MessageInput/>
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

            <div className="flex items-center gap-4">
                {/*video call button*/}
                <button className="hover:bg-gray-100 rounded-full p-2 transition-colors">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {/*voice call button*/}
                <button className="hover:bg-gray-100 rounded-full p-2 transition-colors">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
                    </svg>
                </button>

                {/*exclamation button*/}
                <button className="hover:bg-gray-100 rounded-full p-2 transition-colors">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const MessageInput: React.FC = () => {
    return (
        <div className="mt-auto flex items-center p-4 bg-white rounded-lg">
            <input
                type="text"
                placeholder="Schrijf een bericht"
                className="flex-1 p-2 rounded-lg border border-gray-300 outline-none"
            />
            <button className="ml-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors">
                &#128172;
            </button>
        </div>
    );
};

export default ChatApp;