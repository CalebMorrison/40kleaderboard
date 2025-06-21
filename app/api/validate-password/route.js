export async function POST(request) {
  const submitted = await request.json();
  const { password } = submitted;

  const correctPassword = process.env.EDIT_PASSWORD;

  if (!correctPassword) {
    return new Response(JSON.stringify({ error: 'Server misconfigured. No password set.' }), {
      status: 500,
    });
  }

  if (password === correctPassword) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
}