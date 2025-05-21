import { useState, useCallback, useEffect } from 'react';

export const downloadHandler = async (contentUrl: string, customFilename?: string) => {
    try {
        // Fetch the content
        const response = await fetch(contentUrl);

        if (!response.ok) {
            console.error(`Failed to download: ${response.status} ${response.statusText}`);
            return;
        }

        // Get the blob data
        const blob = await response.blob();

        // Create object URL for the blob
        const objectUrl = URL.createObjectURL(blob);

        // Determine filename and extension
        let filename = customFilename;

        if (!filename) {
            // Extract filename from URL or use a sanitized version of the URL
            const urlFilename = contentUrl.split('/').pop();
            filename = urlFilename || `file_${Date.now()}`;

            // Remove query parameters if present
            filename = filename.split('?')[0];
        }

        // Get file extension from Content-Type if available
        const contentType = response.headers.get('Content-Type');
        if (contentType && !filename.includes('.')) {
            const ext = contentType.split('/').pop();
            if (ext) {
                filename = `${filename}.${ext}`;
            }
        }

        // Create and trigger download link
        const link = document.createElement('a');
        link.href = objectUrl;
        link.setAttribute('download', filename);

        // Add to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL after download starts
        setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
        }, 100);

    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
};

export type DownloadStatus = 'idle' | 'downloading' | 'success' | 'error';

/**
 * Custom React hook to handle file downloads with built-in status tracking.
 *
 * This hook manages the download process and provides a status indicator 
 * (`idle`, `downloading`, `success`, `error`) for UI feedback. It also 
 * automatically resets the status to `idle` after a short delay following 
 * success or failure.
 *
 * @returns {[DownloadStatus, (url: string, customFilename?: string) => Promise<void>]}
 *   A tuple containing:
 *   - `DownloadStatus`: the current state of the download (`'idle'`, `'downloading'`, `'success'`, `'error'`).
 *   - `startDownload`: an async function that initiates a file download from the given URL.
 *
 * @example
 * const [status, startDownload] = useFileDownload();
 * 
 * const handleClick = () => {
 *   startDownload('https://example.com/file.pdf', 'custom-name.pdf');
 * };
 */

const useFileDownload = (): [
    DownloadStatus,
    (url: string, customFilename?: string) => Promise<void>
] => {
    const [status, setStatus] = useState<DownloadStatus>('idle');

    // Cleanup function to reset status after success/error
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => {
                setStatus('idle');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [status]);

    const startDownload = useCallback(async (contentUrl: string, customFilename?: string) => {
        if (!contentUrl) return;

        if (status === 'downloading') return;

        try {
            setStatus('downloading');
            await downloadHandler(contentUrl, customFilename);
            setStatus('success');
        } catch (error) {
            console.error('Download failed:', error);
            setStatus('error');
        }
    }, []);

    return [status, startDownload];
};

export default useFileDownload;