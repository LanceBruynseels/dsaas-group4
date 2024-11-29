'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface User {
    id: string;
    username: string;
    facility: string;
    first_name: string;
    last_name: string;
    is_accepted: boolean;
}

export default function CaretakerHome() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

            setUsers(userData);
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

            // Update local state to reflect the change
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

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Users</h1>
                <p className="mt-2 text-gray-600">Manage and view your assigned users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {user.first_name} {user.last_name}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        user.is_accepted
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {user.is_accepted ? 'Accepted' : 'Pending'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <span className="text-sm">Username:</span>
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        {user.username}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <span className="text-sm">Facility:</span>
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        {user.facility}
                                    </span>
                                </div>
                            </div>

                            {!user.is_accepted ? (
                                <button
                                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                                    onClick={() => handleApprove(user.id)}
                                >
                                    Approve
                                </button>
                            ) : (
                                <div className="mt-4 w-full py-2 px-4 text-center text-green-700 bg-green-50 rounded-md">
                                    Approved
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {users.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No users assigned yet</p>
                        <p className="text-gray-400 text-sm mt-2">Users will appear here once they are assigned to you</p>
                    </div>
                )}
            </div>
        </div>
    );
}