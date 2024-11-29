'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface User {
    id: string;
    username: string | null;
    facility: string | null;
    first_name: string | null;
    last_name: string | null;
    is_accepted: boolean;
}

export default function CaretakerHome() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = createClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                throw new Error('Not authenticated');
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('caretaker_id', user.id);

            if (userError) {
                throw userError;
            }

            setUsers(userData || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_accepted: true })
                .eq('id', userId);

            if (error) {
                throw error;
            }

            setUsers(users.map(user =>
                user.id === userId
                    ? { ...user, is_accepted: true }
                    : user
            ));
        } catch (err) {
            console.error('Error approving user:', err);
            alert('Failed to approve user. Please try again.');
        }
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
            (user.first_name?.toLowerCase() || '').includes(query) ||
            (user.last_name?.toLowerCase() || '').includes(query) ||
            (user.username?.toLowerCase() || '').includes(query)
        );
    });

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
    }

    return (
        <div className="flex h-screen bg-[hsl(10,100%,90%)]">
            {/* Left Sidebar */}
            <div className="w-1/3 p-6 border-r border-gray-200">
                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder="Zoek een cliënt"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>

                <div className="space-y-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="p-3 bg-[hsl(10,100%,95%)] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold truncate">
                                        {user.first_name || ''} {user.last_name || ''}
                                    </div>
                                    <div className="text-gray-500 text-sm truncate">
                                        {user.facility || ''}
                                    </div>
                                </div>
                                {!user.is_accepted && (
                                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col p-6">
                {selectedUser ? (
                    <>
                        <div className="flex items-center justify-between p-4 mb-6 bg-[hsl(10,100%,95%)] rounded-lg">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-bold">
                                        {selectedUser.first_name || ''} {selectedUser.last_name || ''}
                                    </h3>
                                    <p className="text-sm text-gray-500">{selectedUser.facility || ''}</p>
                                </div>
                            </div>
                            {!selectedUser.is_accepted && (
                                <button
                                    onClick={() => handleApprove(selectedUser.id)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                >
                                    Approve User
                                </button>
                            )}
                        </div>
                        <div className="flex-1 bg-[hsl(10,100%,95%)] rounded-lg p-6">
                            <div className="space-y-4">
                                <div>
                                    <span className="font-semibold">Username:</span>
                                    <span className="ml-2">{selectedUser.username || ''}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Status:</span>
                                    <span className={`ml-2 ${selectedUser.is_accepted ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {selectedUser.is_accepted ? 'Accepted' : 'Pending Approval'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a user to view details
                    </div>
                )}
            </div>
        </div>
    );
}