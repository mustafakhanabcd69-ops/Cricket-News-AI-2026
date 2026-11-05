
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("Cricket News AI is running!", {
        headers: cors
      });
    }

    try {
      const { topic } = await request.json();

      if (!topic) {
        throw new Error("Please enter a cricket topic.");
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Cricket News AI.
Create original Urdu cricket content about: ${topic}

Provide:
1. Urdu news script
2. YouTube title
3. Description
4. Hashtags
5. 30-60 second Shorts script

Be neutral to all cricket teams.
Do not invent facts. Clearly mention when information is unverified.`
              }]
            }]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Gemini API error");
      }

      return new Response(
        JSON.stringify({
          result: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
        }),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
