const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string' || id.length !== 10) {
    return res.status(400).json({ error: 'Invalid surprise ID format.' });
  }

  try {
    const data = await kv.get(`s:${id}`);
    if (!data) {
      return res.status(404).json({ error: 'This surprise couldn’t be found. It may have expired or the link is incorrect.' });
    }
    
    // Ensure backwards compatibility with old payloads during transition
    if (data.balloons) {
      data.balloons = data.balloons.map(b => ({
        message: b.message || '',
        imageUrl: b.imageUrl || (b.imageData ? b.imageData : null) // Support old base64 payloads if any still exist
      }));
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Load error:', err);
    return res.status(500).json({ error: 'Failed to safely retrieve the surprise. Please try again.' });
  }
};
