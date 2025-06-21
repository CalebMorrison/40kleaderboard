// app/api/leaderboardApi/route.js

export async function GET() {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  const url = `https://api.jsonbin.io/v3/b/${binId}/latest`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // ensures fresh data
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard' }), {
        status: response.status,
      });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  const url = `https://api.jsonbin.io/v3/b/${binId}`;
  const newData = await request.json();

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to save leaderboard' }), {
        status: response.status,
      });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
