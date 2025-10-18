exports.handler = async function (event, context) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if the API key is even being found by Netlify
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "CRITICAL: GEMINI_API_KEY was not found in Netlify's environment variables. Please check your Netlify site settings."
      }),
    };
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const requestBody = JSON.parse(event.body);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // If the response from Google is NOT okay, capture the error message
    if (!response.ok) {
      const errorBody = await response.text();
      return {
        statusCode: response.status, // e.g., 403
        body: JSON.stringify({
          error: "Received an error response from Google's API.",
          google_status_code: response.status,
          google_error_message: errorBody
        }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to make the fetch request to Google.', details: error.message }),
    };
  }
};
