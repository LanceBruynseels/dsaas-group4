import React from 'react';
import Link from 'next/link';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Authentication Error
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        There was a problem signing you in. Please try again.
                    </p>
                </div>
                <div className="mt-8 text-center">
                    <Link
                        href="/sign-in"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Return to sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;