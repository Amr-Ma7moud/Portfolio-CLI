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

    const timestamp = new Date().toISOString();
    const loginTime = new Date().toUTCString();
    const escapedMessage = message.replace(/\n/g, '\\n').replace(/"/g, '\\"');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[NEW_MESSAGE] from ${name}`,
      html: `
        <div style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace; background: #0a0a0a; color: #e5e5e5; padding: 0; margin: 0;">
          <!-- Terminal Window -->
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; margin: 20px; overflow: hidden;">
            <!-- Terminal Header -->
            <div style="background: #2d2d2d; padding: 10px 15px; border-bottom: 1px solid #333;">
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; margin-right: 8px;"></span>
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; margin-right: 8px;"></span>
              <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #27ca40; margin-right: 8px;"></span>
              <span style="color: #888; font-size: 12px; margin-left: 10px;">contact_form.sh — bash</span>
            </div>
            
            <!-- Terminal Body -->
            <div style="padding: 20px; line-height: 1.8;">
              <p style="margin: 0; color: #888;">Last login: ${loginTime}</p>
              <br/>
              
              <p style="margin: 0;">
                <span style="color: #22c55e;">amr@portfolio</span><span style="color: #888;">:</span><span style="color: #3b82f6;">~/inbox</span><span style="color: #888;">$</span> 
                <span style="color: #e5e5e5;">cat new_message.json</span>
              </p>
              <br/>
              
              <div style="background: #0d0d0d; border: 1px solid #333; border-radius: 4px; padding: 15px; margin: 10px 0;">
                <p style="margin: 0; color: #888;">{</p>
                <p style="margin: 0; padding-left: 20px;">
                  <span style="color: #f472b6;">"sender"</span><span style="color: #888;">:</span> <span style="color: #fbbf24;">"${name}"</span><span style="color: #888;">,</span>
                </p>
                <p style="margin: 0; padding-left: 20px;">
                  <span style="color: #f472b6;">"email"</span><span style="color: #888;">:</span> <span style="color: #fbbf24;">"${email}"</span><span style="color: #888;">,</span>
                </p>
                <p style="margin: 0; padding-left: 20px;">
                  <span style="color: #f472b6;">"timestamp"</span><span style="color: #888;">:</span> <span style="color: #fbbf24;">"${timestamp}"</span><span style="color: #888;">,</span>
                </p>
                <p style="margin: 0; padding-left: 20px;">
                  <span style="color: #f472b6;">"message"</span><span style="color: #888;">:</span> <span style="color: #fbbf24;">"${escapedMessage}"</span>
                </p>
                <p style="margin: 0; color: #888;">}</p>
              </div>
              <br/>
              
              <p style="margin: 0;">
                <span style="color: #22c55e;">amr@portfolio</span><span style="color: #888;">:</span><span style="color: #3b82f6;">~/inbox</span><span style="color: #888;">$</span> 
                <span style="color: #e5e5e5;">echo "Reply to: ${email}"</span>
              </p>
              <p style="margin: 0; color: #22c55e;">Reply to: <a href="mailto:${email}" style="color: #22c55e;">${email}</a></p>
              <br/>
              
              <p style="margin: 0;">
                <span style="color: #22c55e;">amr@portfolio</span><span style="color: #888;">:</span><span style="color: #3b82f6;">~/inbox</span><span style="color: #888;">$</span> 
                <span style="color: #888;">█</span>
              </p>
            </div>
          </div>
          
          <p style="color: #555; font-size: 11px; text-align: center; padding: 10px;">
            // Sent from amr-mahmoud.dev contact form
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
