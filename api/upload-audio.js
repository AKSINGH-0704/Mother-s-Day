'use strict';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { audioBase64 } = req.body;
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return res.status(400).json({ error: 'Missing audio data' });
    }

    const mimeMatch = audioBase64.match(/^data:(audio\/[^;]+);base64,/);
    const contentType = mimeMatch ? mimeMatch[1] : 'audio/mpeg';
    const ext = contentType.split('/')[1]?.split(';')[0] || 'mp3';
    const base64Data = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > 20 * 1024 * 1024) {
      return res.status(400).json({ error: 'Audio too large. Max 20MB.' });
    }

    const filename = `audio-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

    // ── Method 1: Vercel Blob (if credentials available) ────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = require('@vercel/blob');
        const blob = await put(filename, buffer, { access: 'public', contentType });
        console.log('Audio uploaded to Vercel Blob:', blob.url);
        return res.status(200).json({ url: blob.url });
      } catch (e) {
        console.warn('Blob upload failed, trying fallback:', e.message);
      }
    }

    // ── Method 2: 0x0.st — free, no auth, files kept up to 1 year ──────────
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
          console.log('Audio uploaded to 0x0.st:', url);
          return res.status(200).json({ url });
        }
      }
    } catch (e) {
      console.warn('0x0.st upload failed:', e.message);
    }

    // ── Method 3: tmpfiles.org — free, no auth, files kept 1 hour ──────────
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
          // Convert page URL to direct download URL
          const url = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          console.log('Audio uploaded to tmpfiles.org:', url);
          return res.status(200).json({ url });
        }
      }
    } catch (e) {
      console.warn('tmpfiles.org upload failed:', e.message);
    }

    // All methods failed — inform client gracefully
    return res.status(500).json({
      error: 'Audio could not be uploaded to any service. The link will work without audio.'
    });

  } catch (err) {
    console.error('Audio upload error:', err);
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '25mb' } } };
