import { Resend } from 'resend';

const TO_EMAIL = 'amrmahmouddev05@gmail.com';
const FROM_EMAIL = 'Contact Form <onboarding@resend.dev>';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, message' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
            📬 New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #374151;">From:</strong> ${name}
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #374151;">Email:</strong> 
              <a href="mailto:${email}" style="color: #22c55e;">${email}</a>
            </p>
          </div>
          
          <div style="background: #1a1a1a; color: #e5e5e5; padding: 20px; border-radius: 8px; font-family: 'Monaco', 'Menlo', monospace;">
            <p style="margin: 0 0 10px 0; color: #22c55e;">$ cat message.txt</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data?.id 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
