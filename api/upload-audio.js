const { put } = require('@vercel/blob');

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
    const ext = contentType.split('/')[1] || 'mp3';
    const base64Data = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (buffer.length > 20 * 1024 * 1024) {
      return res.status(400).json({ error: 'Audio too large. Max 20MB.' });
    }

    const filename = `audio-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const blob = await put(filename, buffer, { access: 'public', contentType });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Audio upload error:', err);
    return res.status(500).json({ error: 'Failed to upload audio. Please try again.' });
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '25mb' } } };
