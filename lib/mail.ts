import nodemailer from 'nodemailer';

export interface FeedbackEmailParams {
  toEmail: string;
  userName?: string;
  rating: number;
  type: string;
  message: string;
  isMarathi?: boolean;
}

export interface FeedbackAdminNotificationParams {
  userEmail: string;
  userName?: string;
  userId?: string;
  rating: number;
  type: string;
  message: string;
  feedbackId?: string;
}

const TYPE_LABELS: Record<string, { en: string; mr: string }> = {
  experience: { en: 'Travel Experience & Insights', mr: 'पुणे प्रवास अनुभव' },
  new_spot: { en: 'Suggest a New Spot / Hidden Gem', mr: 'नवीन ठिकाणाची शिफारस' },
  correction: { en: 'Hours / Ticket / Transit Correction', mr: 'वेळ / तिकीट दुरुस्ती' },
  feature: { en: 'Platform Feature Suggestion', mr: 'नवीन फीचरची कल्पना' },
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 6000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });
  }

  // If standard Gmail user/app password are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 6000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });
  }

  return null;
}

/**
 * 1. SENDS AUTOMATED CONFIRMATION & THANK-YOU EMAIL TO THE USER
 * Includes user's profile name, their feedback content, and personal note from Suraj Dhok & Sahil Jadhav.
 * The personal email address of the creators is strictly protected and NEVER revealed to the client!
 */
export async function sendFeedbackConfirmationEmail(params: FeedbackEmailParams) {
  const { toEmail, userName, rating, type, message, isMarathi } = params;
  if (!toEmail || !toEmail.includes('@')) {
    return { success: false, reason: 'Invalid recipient email' };
  }

  const categoryName = TYPE_LABELS[type] || { en: type, mr: type };
  const stars = '★'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - rating));

  // Protected sender display: personal email address is completely masked
  const senderName = process.env.FEEDBACK_SENDER_NAME || 'Suraj Dhok and Sahil Jadhav - Explore Pune';
  const senderEmail = process.env.SMTP_FROM || 'no-reply@explorepune.in';
  const fromHeader = `"${senderName}" <${senderEmail}>`;

  const subject = isMarathi
    ? 'पुणे भ्रमंती अभिप्राय नोंदणीबद्दल मनःपूर्वक धन्यवाद! 🙏 | सुरज ढोक आणि साहिल जाधव'
    : 'Thank you for your valuable feedback on Explore Pune! 🙏 | Suraj Dhok & Sahil Jadhav';

  const htmlContent = `
<!DOCTYPE html>
<html lang="${isMarathi ? 'mr' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Top Decorative Header -->
    <div style="background: linear-gradient(135deg, #c2410c 0%, #d97706 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 36px; margin-bottom: 8px;">🚩</div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Explore Pune | एक्सप्लोर पुणे</h1>
      <p style="margin: 6px 0 0; font-size: 13.5px; opacity: 0.95; color: #fef08a;">पुणे आणि सह्याद्रीच्या ऐतिहासिक वाटा • Official Tourism & Heritage Guide</p>
    </div>

    <!-- Letter Body -->
    <div style="padding: 32px 26px;">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #c2410c; font-weight: 800;">
        ${isMarathi ? 'आपले बहुमोल मत दिल्याबद्दल मनःपूर्वक धन्यवाद! 🙏' : 'Thank You for Your Valuable Feedback! 🙏'}
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px;">
        ${
          isMarathi
            ? `सस्नेह नमस्कार <strong>${userName || 'पर्यटक मित्र'}</strong>,`
            : `Dear <strong>${userName || 'Explorer'}</strong>,`
        }
      </p>

      <p style="font-size: 14.5px; line-height: 1.65; color: #334155; margin: 0 0 18px;">
        ${
          isMarathi
            ? 'एक्सप्लोर पुणे (Explore Pune) संकेतस्थळावर आपला बहुमोल अभिप्राय आणि विचार नोंदवल्याबद्दल आम्ही आपले मनापासून आभारी आहोत. पुण्यातील गड-किल्ले, पेशवेकालीन वाडे, प्रसिद्ध मंदिरे, सार्वजनिक वाहतूक (पुणे मेट्रो व बस मार्ग) आणि सहल नियोजन अधिक अचूक व परिपूर्ण बनवण्यासाठी आपल्या प्रत्येक सूचनेचा आम्हाला मोठा अभिमान आहे.'
            : 'Thank you very much for sharing your valuable opinion and experience with Explore Pune. Your feedback is instrumental in helping us continuously verify opening times, refine public transit guides (Metro & PMPML bus routes), and celebrate the authentic heritage of Pune for travelers from across the world.'
        }
      </p>

      <!-- Feedback Details Box -->
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-left: 4px solid #c2410c; border-radius: 10px; padding: 18px 20px; margin: 22px 0;">
        <div style="font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
          ${isMarathi ? 'आपण नोंदवलेला अभिप्राय तपशील:' : 'Summary of Your Feedback:'}
        </div>
        <div style="font-size: 14px; margin-bottom: 6px; color: #334155;">
          <strong>${isMarathi ? 'अनुभव / रेटिंग:' : 'Experience Rating:'}</strong> <span style="color: #d97706; font-size: 16px;">${stars}</span> (${rating}/5)
        </div>
        <div style="font-size: 14px; margin-bottom: 8px; color: #334155;">
          <strong>${isMarathi ? 'वर्गवारी:' : 'Category:'}</strong> ${isMarathi ? categoryName.mr : categoryName.en}
        </div>
        <div style="font-size: 14px; color: #0f172a; margin-top: 10px; font-style: italic; background: #ffffff; padding: 12px 14px; border-radius: 8px; border: 1px solid #cbd5e1; line-height: 1.5;">
          &ldquo;${message}&rdquo;
        </div>
      </div>

      <!-- Note from Creators -->
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; margin: 22px 0;">
        <strong style="color: #92400e; font-size: 14px; display: block; margin-bottom: 6px;">
          💌 ${isMarathi ? 'संस्थापकांकडून संदेश:' : 'A Personal Note from the Creators:'}
        </strong>
        <p style="font-size: 13.5px; line-height: 1.6; color: #78350f; margin: 0;">
          ${
            isMarathi
              ? 'आम्ही आपल्या प्रत्येक सूचनेचा वैयक्तिक अभ्यास करून आवश्यक अद्यतने करू. आपल्या सहकार्यामुळे पुणे भ्रमंतीचा हा उपक्रम अधिक परिपूर्ण बनत आहे. पुढील सहलींसाठी मनःपूर्वक शुभेच्छा!'
              : 'We personally read and evaluate every single suggestion to keep Explore Pune the most comprehensive and authentic guide for Punekars and Sahyadri trekkers alike. Thank you for walking this path with us!'
          }
        </p>
      </div>

      <!-- Mandatory Signature from Suraj Dhok & Sahil Jadhav -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1.5px solid #e2e8f0;">
        <p style="font-size: 14px; margin: 0 0 4px; color: #64748b;">
          ${isMarathi ? 'सस्नेह नमस्कार,' : 'Warm regards,'}
        </p>
        <p style="font-size: 16px; font-weight: 800; color: #c2410c; margin: 0;">
          Suraj Dhok and Sahil Jadhav
        </p>
        <p style="font-size: 12.5px; color: #64748b; margin: 3px 0 0;">
          Creators & Developers, Explore Pune Team
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11.5px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px;">
        Explore Pune • Verified Tourism, Sahyadri Trails & Transit Guide
      </p>
      <p style="margin: 0;">
        This confirmation was sent securely on behalf of Suraj Dhok &amp; Sahil Jadhav.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Explore Pune | एक्सप्लोर पुणे
==================================================
${isMarathi ? 'आपले बहुमोल मत दिल्याबद्दल मनःपूर्वक धन्यवाद! 🙏' : 'Thank You for Your Valuable Feedback! 🙏'}

${isMarathi ? `सस्नेह नमस्कार ${userName || 'पर्यटक मित्र'},` : `Dear ${userName || 'Explorer'},`}

${
  isMarathi
    ? 'एक्सप्लोर पुणे (Explore Pune) संकेतस्थळावर आपला बहुमोल अभिप्राय आणि विचार नोंदवल्याबद्दल आम्ही आपले मनापासून आभारी आहोत. आपल्या सूचनेमुळे आम्हाला पुण्याचे गड-किल्ले, वाडे, मेट्रो व बस मार्ग अधिक परिपूर्ण बनवण्यास मदत होते.'
    : 'Thank you very much for taking the time to share your feedback and opinion with Explore Pune. Your insights help us continually improve the platform for all visitors and Punekars.'
}

Feedback Details:
- Rating: ${rating}/5 (${stars})
- Category: ${categoryName.en}
- Message: "${message}"

Warm regards / सस्नेह नमस्कार,
Suraj Dhok and Sahil Jadhav
Creators & Developers, Explore Pune Team
https://punetrail.web.app
==================================================
`;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: toEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (err: any) {
      console.warn('Failed to send mail via SMTP transporter:', err?.message || err);
      return { success: false, error: err?.message, mode: 'smtp_failed' };
    }
  }

  // Graceful development / non-SMTP fallback:
  console.log(
    `[Explore Pune Mailer] Automated thank-you email prepared for ${toEmail} from Suraj Dhok & Sahil Jadhav.`
  );
  return { success: true, mode: 'simulated_fallback' };
}

/**
 * 2. SENDS AN EMAIL NOTIFICATION TO US (SURAJ DHOK & SAHIL JADHAV)
 * Whenever a user submits feedback, the admin team receives the complete feedback details!
 */
export async function sendFeedbackAdminNotificationEmail(params: FeedbackAdminNotificationParams) {
  const { userEmail, userName, userId, rating, type, message, feedbackId } = params;
  const adminEmail = process.env.ADMIN_FEEDBACK_EMAIL || 'suraj.dhok24@mmit.edu.in';

  const categoryName = TYPE_LABELS[type] || { en: type, mr: type };
  const stars = '★'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - rating));

  const senderEmail = process.env.SMTP_FROM || 'no-reply@explorepune.in';
  const fromHeader = `"Explore Pune Feedback System" <${senderEmail}>`;

  const subject = `[New Feedback] ${userName || 'User'} (${rating}★ - ${categoryName.en})`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px;">
    <h2 style="margin: 0 0 16px; color: #c2410c; border-bottom: 2px solid #fdba74; padding-bottom: 8px;">
      🔔 New User Feedback Received
    </h2>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 140px;">Explorer Name:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${userName || 'Anonymous'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Explorer Email:</td>
        <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${userEmail}">${userEmail}</a></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold;">User ID:</td>
        <td style="padding: 6px 0; color: #64748b; font-family: monospace;">${userId || 'Guest'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Category:</td>
        <td style="padding: 6px 0; color: #0f172a;">${categoryName.en} (${categoryName.mr})</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Rating:</td>
        <td style="padding: 6px 0; color: #d97706; font-size: 16px;">${stars} (${rating} / 5)</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Submitted At:</td>
        <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
      </tr>
      ${feedbackId ? `
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Feedback ID:</td>
        <td style="padding: 6px 0; color: #64748b; font-family: monospace;">${feedbackId}</td>
      </tr>` : ''}
    </table>

    <div style="background: #f1f5f9; border-radius: 8px; padding: 14px 16px; margin: 16px 0; border-left: 4px solid #c2410c;">
      <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
        Feedback Message:
      </div>
      <div style="font-size: 14.5px; line-height: 1.6; color: #0f172a; white-space: pre-wrap;">
${message}
      </div>
    </div>

    <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 16px;">
      Explore Pune Admin Dispatcher • Sent to ${adminEmail}
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
[New Feedback Received on Explore Pune]
=========================================
Explorer: ${userName || 'Anonymous'}
Email: ${userEmail}
Rating: ${rating}/5 (${stars})
Category: ${categoryName.en}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

Message:
"${message}"

Feedback ID: ${feedbackId || 'N/A'}
=========================================
`;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: adminEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (err: any) {
      console.warn('Failed to send admin notification via SMTP:', err?.message || err);
      return { success: false, error: err?.message, mode: 'smtp_failed' };
    }
  }

  console.log(
    `[Explore Pune Mailer] Admin notification prepared for ${adminEmail} regarding feedback from ${userEmail}.`
  );
  return { success: true, mode: 'simulated_fallback' };
}
