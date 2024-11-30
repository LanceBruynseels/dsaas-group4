import React, { useEffect, useState } from 'react';

const TextContent = ({ url }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const content = await response.text();
                    setText(content);
                } else {
                    setText('Failed to load text content.');
                }
            } catch (error) {
                console.error('Error fetching text:', error);
                setText('Error loading text content.');
            }
        };

        fetchText();
    }, [url]);

    return <div className="text-content p-2 border rounded-lg">{text}</div>;
};

export default TextContent;
