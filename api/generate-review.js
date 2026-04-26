export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Log the full data to Vercel so you can see exactly what Google said
    console.log("Full Google Response:", JSON.stringify(data));

    // Check if candidates exists and has content
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      return res.status(200).json({ text: text.trim() });
    } else {
      // If there's no text, send the whole data object so we can debug
      return res.status(200).json({ 
        text: null, 
        debug: data 
      });
    }
    
  } catch (error) {
    return res.status(500).json({ error: 'Server Error', details: error.message });
  }
}