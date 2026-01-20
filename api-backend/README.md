# Portfolio Contact API

Vercel serverless function to handle contact form submissions.

## Setup
w
### 1. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Go to **API Keys** → **Create API Key**
3. Copy the API key

### 2. Deploy to Vercel

```bash
cd api-backend

# Install dependencies
npm install

# Login to Vercel (if not already)
vercel login

# Deploy (it will prompt for project setup)
vercel

# Add the environment variable
vercel env add RESEND_API_KEY

# Deploy to production
vercel --prod
```

### 3. Note Your API URL

After deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

Your contact endpoint will be:
```
https://your-project-name.vercel.app/api/contact
```

## Testing

Test with curl:
```bash
curl -X POST https://your-project-name.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}'
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key |

## Optional: Custom Domain Email

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. In Resend, go to **Domains** → **Add Domain**
2. Add DNS records to verify your domain
3. Update `FROM_EMAIL` in `api/contact.ts`
