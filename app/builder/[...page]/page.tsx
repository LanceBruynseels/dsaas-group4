/* eslint-disable */
// @ts-nocheck
'use client';

import { builder } from '@builder.io/react';
import { RenderBuilderContent } from '@/components/builder';
import { useEffect, useState } from 'react';

// Your Builder.io API key
builder.init('ab2c2ceb389045f397e3deaac91c4b88');

interface PageProps {
    params: {
        page: string[]; // Optional to handle cases where no dynamic route is provided
    };
}

export default function Page({ params }: PageProps) {
    const [content, setContent] = useState<any>(null); // Type can be improved based on `RenderBuilderContent` props

    useEffect(() => {
        // Handle the dynamic path; defaults to root `/` if no path is provided
        const path = '/' + (params?.page?.join('/') || '');
        builder
            .get('page', { url: path })
            .promise()
            .then((data) => setContent(data))
            .catch((err) => console.error('Failed to fetch Builder.io content:', err));
    }, [params?.page]);

    return content ? (
        <RenderBuilderContent content={content} />
    ) : (
        <p>Loading...</p>
    );
}
