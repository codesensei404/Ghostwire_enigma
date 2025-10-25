export default async function handler(request, response) {
  const apiKey = process.env.GEMINI_API_KEY;
  const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY environment variable not found.");
    return response.status(500).json({
      error: "API key is not configured on the server. Please check Vercel environment variables."
    });
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const googleResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body), 
    });


    if (!googleResponse.ok) {
      const errorBody = await googleResponse.text();
      console.error(`Error from Google API: ${googleResponse.status}`, errorBody);

      return response.status(googleResponse.status).json({
          error: "Received an error response from Google's API.",
          google_status_code: googleResponse.status,
          google_error_message: errorBody
      });
    }

    const data = await googleResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    console.error("Error in Vercel function:", error);
    return response.status(500).json({ error: 'An internal server error occurred in the proxy function.' });
  }
}

