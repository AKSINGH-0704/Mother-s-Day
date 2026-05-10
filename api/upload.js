const { put } = require('@vercel/blob');

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

    // Convert base64 to buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Validate size (max 2MB per image to be safe after compression)
    if (buffer.length > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Max 2MB allowed.' });
    }

    // Put into Vercel Blob
    const filename = `bloom-${Date.now()}-${Math.random().toString(36).substring(2,7)}.jpg`;
    const blob = await put(filename, buffer, { 
      access: 'public',
      contentType: 'image/jpeg' 
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    // Silent fail over to using a placeholder or returning a graceful error
    return res.status(500).json({ error: 'Failed to upload image. Please try again or remove the image.' });
  }
};

module.exports.config = {
  api: { bodyParser: { sizeLimit: '4mb' } }
};
