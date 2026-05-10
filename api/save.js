const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const data = req.body;
    
    // Strong Validation
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid payload format.' });
    }

    if (data.name && data.name.length > 50) {
      return res.status(400).json({ error: 'Name is too long. Max 50 characters.' });
    }

    if (!data.balloons || !Array.isArray(data.balloons)) {
      return res.status(400).json({ error: 'Missing memories data.' });
    }

    const validBlooms = data.balloons.filter(b => b && typeof b.message === 'string' && b.message.trim().length > 0);
    if (validBlooms.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 memories.' });
    }

    if (validBlooms.some(b => b.message.length > 200)) {
      return res.status(400).json({ error: 'One of the memories is too long. Max 200 characters per memory.' });
    }

    if (data.finalMessage && data.finalMessage.length > 1000) {
      return res.status(400).json({ error: 'Final message is too long. Max 1000 characters.' });
    }

    // Clean data to store (only strings and URLs)
    const safeData = {
      relationship: data.relationship || 'Mom',
      name: data.name ? data.name.trim() : '',
      finalMessage: data.finalMessage ? data.finalMessage.trim() : '',
      balloons: validBlooms.map(b => ({
        message: b.message.trim(),
        imageUrl: typeof b.imageUrl === 'string' && b.imageUrl.startsWith('https://') ? b.imageUrl : null
      }))
    };

    // Protect payload size of cleaned data to prevent KV abuse
    if (JSON.stringify(safeData).length > 20000) {
      return res.status(400).json({ error: 'Payload size limit exceeded. Please try using shorter messages.' });
    }

    // Generate short random ID
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    // Store for 365 days
    const expiresAt = Date.now() + 365 * 24 * 60 * 60 * 1000;
    await kv.set(`s:${id}`, safeData, { ex: 365 * 24 * 60 * 60 });

    return res.status(200).json({ id, expiresAt });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ error: 'Failed to safely store your surprise. Please try again.' });
  }
};

module.exports.config = {
  api: { bodyParser: { sizeLimit: '1mb' } } // Dramatically reduced payload size expectation
};
