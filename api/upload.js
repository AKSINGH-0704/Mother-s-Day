'use strict';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const mimeMatch = imageBase64.match(/^data:(image\/[^;]+);base64,/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
    const base64Data = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Max 8MB.' });
    }

    const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

    // ── Method 1: Vercel Blob (if credentials available) ────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = require('@vercel/blob');
        const blob = await put(filename, buffer, { access: 'public', contentType });
        console.log('Image uploaded to Vercel Blob:', blob.url);
        return res.status(200).json({ url: blob.url });
      } catch (e) {
        console.warn('Blob upload failed, trying fallback:', e.message);
      }
    }

    // ── Method 2: 0x0.st — free, no auth, files kept months to a year ───────
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      formData.append('file', blob, filename);

      const r = await fetch('https://0x0.st', {
        method: 'POST',
        body: formData,
        headers: { 'User-Agent': 'SurpriseCreator/1.0' },
        signal: AbortSignal.timeout(15000)
      });

      if (r.ok) {
        const url = (await r.text()).trim();
        if (url.startsWith('https://')) {
          console.log('Image uploaded to 0x0.st:', url);
          return res.status(200).json({ url });
        }
      }
    } catch (e) {
      console.warn('0x0.st image upload failed:', e.message);
    }

    // ── Method 3: catbox.moe — free, permanent, anonymous uploads ───────────
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', blob, filename);

      const r = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(15000)
      });

      if (r.ok) {
        const url = (await r.text()).trim();
        if (url.startsWith('https://')) {
          console.log('Image uploaded to catbox.moe:', url);
          return res.status(200).json({ url });
        }
      }
    } catch (e) {
      console.warn('catbox.moe upload failed:', e.message);
    }

    // ── Method 4: tmpfiles.org — free, 1 hour expiry, last resort ───────────
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      formData.append('file', blob, filename);

      const r = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(15000)
      });

      if (r.ok) {
        const data = await r.json();
        if (data?.data?.url) {
          const url = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          console.log('Image uploaded to tmpfiles.org:', url);
          return res.status(200).json({ url });
        }
      }
    } catch (e) {
      console.warn('tmpfiles.org image upload failed:', e.message);
    }

    // All methods failed
    return res.status(500).json({ error: 'All image upload methods failed.' });

  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '12mb' } } };
