'use client'
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Use the client-side Supabase client

const supabase = createClient();

const UploadContent: React.FC = () => {
    const [textContent, setTextContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null); // Clear any previous errors
            console.log('File selected:', file);
        }
    };

    const handleUpload = async () => {
        if (!textContent.trim() && !selectedFile) {
            setError('Please provide text or select a file to upload.');
            return;
        }

        try {
            let fileName: string;
            let contentToUpload: File | Blob;

            if (selectedFile) {
                // Handle file upload (image)
                fileName = `images/${Date.now()}-${selectedFile.name}`;
                contentToUpload = selectedFile;
                console.log('Preparing to upload image:', fileName);
            } else {
                // Handle text upload
                fileName = `texts/${Date.now()}-message.txt`;
                contentToUpload = new Blob([textContent], { type: 'text/plain' });
                console.log('Preparing to upload text:', fileName);
            }

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase
                .storage
                .from('Messages') // Use your bucket name
                .upload(fileName, contentToUpload);

            if (uploadError) {
                console.error('Supabase upload error:', uploadError.message);
                setError(`Upload failed: ${uploadError.message}`);
                return;
            }

            console.log('File uploaded successfully:', data);

            // Get the public URL for the uploaded file
            const { data: urlData } = supabase.storage.from('Messages').getPublicUrl(fileName);
            const publicURL = urlData?.publicUrl;

            if (!publicURL) {
                setError('Failed to get public URL for the uploaded content.');
                return;
            }

            setUploadedUrl(publicURL);
            setError(null);
            console.log('Content uploaded successfully with public URL:', publicURL);

            // Reset inputs
            setTextContent('');
            setSelectedFile(null);
        } catch (e) {
            console.error('Unexpected error during upload:', e);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div>
            <h2>Upload Content</h2>
            <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your text here"
                rows={4}
                disabled={!!selectedFile} // Disable if an image is selected
            />
            <p>OR</p>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={!!textContent.trim()} />
            <button onClick={handleUpload}>Upload Content</button>

            {uploadedUrl && (
                <div>
                    <p>Content uploaded successfully. Public URL:</p>
                    <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                        {uploadedUrl.includes('.txt') ? 'View Text' : <img src={uploadedUrl} alt="Uploaded" width="200" />}
                    </a>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UploadContent;
