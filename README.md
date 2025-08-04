# DM Me

A simple Express server for sending emails via Gmail.

## Environment Variables

The application uses the following environment variables:

- `AUTH_EMAIL` – Gmail address used to authenticate the mail transporter.
- `AUTH_PASS` – Password or app password for the above Gmail account.
- `PORT` – _(Optional)_ Port for the server to listen on. Defaults to `6001`.

### Sample `.env`

```env
AUTH_EMAIL=your-email@gmail.com
AUTH_PASS=your-app-password
PORT=6001
```

## Usage

1. Create a `.env` file based on the variables above.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.
