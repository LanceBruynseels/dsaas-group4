'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string | null;
    facility: string | null;
    first_name: string | null;
    last_name: string | null;
    is_accepted: boolean;
    is_banned: boolean;
}

interface Report {
    id: string;
    title: string;
    description: string | null;
    groupchat_title: string; // Added groupchat_title
}


export default function CaretakerHome() {
    const [users, setUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = createClient();
    const router = useRouter(); // for sign out

    // use useMemo to improve filtering performance
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const query = searchQuery.toLowerCase();
            return (
                (user.first_name?.toLowerCase() || '').includes(query) ||
                (user.last_name?.toLowerCase() || '').includes(query) ||
                (user.username?.toLowerCase() || '').includes(query)
            );
        });
    }, [users, searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchReports(selectedUser.id);
        }
    }, [selectedUser]);


    async function fetchUsers() {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error('Not authenticated');

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('caretaker_id', user.id);

            if (userError) throw userError;

            setUsers(userData || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }
    async function fetchReports(userId: string) {
        try {
            const { data: reportData, error: reportError } = await supabase
                .from('reports')
                .select('*')
                .eq('user_id', userId);

            if (reportError) throw reportError;

            // Map reports to assign a title starting from 1 and add groupchat title
            const enrichedReports = await Promise.all(
                (reportData || []).map(async (report, index) => {
                    // Fetch the group chat title based on the groupchat_id
                    const { data: groupchatData, error: groupchatError } = await supabase
                        .from('discover_chats')
                        .select('title')
                        .eq('id', report.groupchat_id)
                        .single();  // Use .single() as we expect only one result

                    if (groupchatError) {
                        console.error('Error fetching group chat title:', groupchatError);
                        return {
                            ...report,
                            title: `Report ${index + 1}`,  // Default title if groupchat fetch fails
                            groupchat_title: 'Unknown',  // Default fallback value for the group chat title
                        };
                    }

                    return {
                        ...report,
                        title: `Report ${index + 1}`,  // Start numbering from 1
                        groupchat_title: groupchatData?.title || 'No Title',  // Use the fetched title
                    };
                })
            );

            setReports(enrichedReports);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setReports([]);
        }
    }


    const handleApprove = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_accepted: true })
                .eq('id', userId);

            if (error) throw error;

            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, is_accepted: true } : user
            );
            setUsers(updatedUsers);
            setSelectedUser(prevUser =>
                prevUser?.id === userId ? { ...prevUser, is_accepted: true } : prevUser
            );
        } catch (err) {
            console.error('Error approving user:', err);
            alert('Failed to approve user. Please try again.');
        }
    };


    const handleBan = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_banned: true })
                .eq('id', userId);

            if (error) throw error;

            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, is_banned: true } : user
            );
            setUsers(updatedUsers);
            setSelectedUser(prevUser =>
                prevUser?.id === userId ? { ...prevUser, is_banned: true } : prevUser
            );
        } catch (err) {
            console.error('Error banning user:', err);
            alert('Failed to ban user. Please try again.');
        }
    };

    const handleResume = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_banned: false })
                .eq('id', userId);

            if (error) throw error;

            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, is_banned: false } : user
            );
            setUsers(updatedUsers);
            setSelectedUser(prevUser =>
                prevUser?.id === userId ? { ...prevUser, is_banned: false } : prevUser
            );
        } catch (err) {
            console.error('Error resuming user:', err);
            alert('Failed to resume user. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/sign-in');
        } catch (err) {
            console.error('Error signing out:', err);
            alert('Failed to sign out. Please try again.');
        }
    };
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
    }

    return (
        <div className="flex h-screen bg-[hsl(10,100%,90%)]">
            {/* Left Sidebar */}
            <div className="w-1/3 p-6 border-r border-gray-200 flex flex-col">
                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder="Zoek een cliënt"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20}/>
                </div>

                <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    title="Sign out"
                >
                    <LogOut className="text-red-600" size={24}/>
                </button>

                <div className="space-y-4 overflow-y-auto">
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
                                {user.is_banned && (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                        Banned
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
                            <div className="space-x-2">
                                {!selectedUser.is_accepted && !selectedUser.is_banned && (
                                    <button
                                        onClick={() => handleApprove(selectedUser.id)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                    >
                                        Approve User
                                    </button>
                                )}
                                {selectedUser.is_accepted && !selectedUser.is_banned && (
                                    <button
                                        onClick={() => handleBan(selectedUser.id)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                    >
                                        Ban User
                                    </button>
                                )}
                                {selectedUser.is_banned && (
                                    <button
                                        onClick={() => handleResume(selectedUser.id)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                    >
                                        Resume User
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 bg-[hsl(10,100%,95%)] rounded-lg p-6">
                            <div className="space-y-4">
                                <div>
                                    <span className="font-semibold">Username:</span>
                                    <span className="ml-2">{selectedUser.username || ''}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Status:</span>
                                    <span className={`ml-2 ${
                                        selectedUser.is_banned
                                            ? 'text-red-600'
                                            : selectedUser.is_accepted
                                                ? 'text-green-600'
                                                : 'text-yellow-600'
                                    }`}>
                                        {selectedUser.is_banned
                                            ? 'Banned'
                                            : selectedUser.is_accepted
                                                ? 'Active'
                                                : 'Pending Approval'}
                                    </span>
                                </div>
                            </div>
                            <h4 className="font-semibold text-l mb-4">Reports</h4>
                            {reports.length > 0 ? (
                                <ul className="space-y-3">
                                    {reports.map(report => (
                                        <li key={report.id} className="p-3 bg-white rounded-lg shadow">
                                            <h5 className="font-bold">{report.title}</h5>
                                            <p className="text-gray-600">{report.description || 'No description'}</p>
                                            <h4 className="text-gray-500 font-bold">Group Chat: {report.groupchat_title}</h4>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No reports available for this user.</p>
                            )}
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