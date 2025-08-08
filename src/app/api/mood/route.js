import { NextResponse } from 'next/server';

export async function POST(req) {
  const { mood } = await req.json();
  const geminiKey = process.env.GEMINI_API_KEY;
  const youtubeKey = process.env.YOUTUBE_API_KEY;

  if (!geminiKey || !youtubeKey) {
    return NextResponse.json({ error: 'Missing API keys' }, { status: 500 });
  }

  // Prompt Gemini to generate only song titles
  const prompt = `
Based on the mood: "${mood}", generate a list of 5 to 7 song titles (no links), just names that match the emotional tone or vibe. Output the response as a JSON array of strings like:

[
  "Night Changes - One Direction",
  "Let Her Go - Passenger",
  ...
]
`;

  try {
    // Gemini API Call
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      }),
    });

    const result = await geminiRes.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    // Extract song list
    const match = rawText.match(/\[([\s\S]+?)\]/);
    const cleanJson = match ? `[${match[1]}]` : '[]';
    const songTitles = JSON.parse(cleanJson);

    const songs = [];

    // Search each song on YouTube
    for (const title of songTitles) {
      const query = encodeURIComponent(title);
      const ytRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${youtubeKey}`
      );

      const ytData = await ytRes.json();
      const video = ytData.items?.[0];

      if (video) {
        songs.push({
          title,
          link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet?.thumbnails?.default?.url,
          artist: video.snippet?.channelTitle || 'Unknown Artist'
        });
      }
    }

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
