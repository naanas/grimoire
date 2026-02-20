export function getGoogleDriveDirectLink(url: string): string {
    if (!url) return '';

    // Check if it's a Google Drive link
    if (!url.includes('drive.google.com')) return url;

    try {
        let id = '';

        // Pattern 1: /file/d/ID/...
        // Regex handles: /d/ID/ or /d/ID
        const matchFile = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (matchFile && matchFile[1]) {
            id = matchFile[1];
        }

        // Pattern 2: ?id=ID
        if (!id) {
            const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (matchId && matchId[1]) {
                id = matchId[1];
            }
        }

        if (id) {
            // Using &confirm=t to bypass possible virus scan warning for large files, 
            // though this is not always 100% reliable without an API key handling, 
            // it's the standard workaround for direct links.
            // However, confirm=t usually requires a cookie or interaction. 
            // For <video> src, we just hope the file is small enough or the redirect works.
            return `https://drive.google.com/uc?export=download&id=${id}`;
        }
    } catch (e) {
        console.error("Error parsing Drive URL", e);
    }

    return url;
}
