exports.handler = async function (event, context) {
  // Get the secret API key from Netlify's environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // Get the user's request from the browser
  const requestBody = JSON.parse(event.body);

  try {
    // Securely forward the request to Google
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // Pass the error from Google back to the browser
      return {
        statusCode: response.status,
        body: `Error from Google API: ${errorBody}`
      };
    }

    const data = await response.json();

    // Send Google's successful response back to the browser
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
