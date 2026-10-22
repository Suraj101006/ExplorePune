import nodemailer from 'nodemailer';
import { generateItineraryPdf, ItineraryPdfData } from './generateItineraryPdf';

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

export interface ItineraryEmailParams {
  toEmail: string;
  userName?: string;
  itineraryData: ItineraryPdfData;
  isMarathi?: boolean;
}

export const DEFAULT_EXPLORE_EMAIL = 'explorepune232@gmail.com';
export const DEFAULT_EXPLORE_SENDER_NAME = 'ExplorePune Team';

export function getExplorePuneFromHeader(): string {
  const senderName = process.env.FEEDBACK_SENDER_NAME || DEFAULT_EXPLORE_SENDER_NAME;
  const senderEmail =
    process.env.SMTP_FROM ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    DEFAULT_EXPLORE_EMAIL;
  return `"${senderName}" <${senderEmail}>`;
}

const TYPE_LABELS: Record<string, { en: string; mr: string }> = {
  experience: { en: 'Travel Experience & Insights', mr: 'पुणे प्रवास अनुभव' },
  new_spot: { en: 'Suggest a New Spot / Hidden Gem', mr: 'नवीन ठिकाणाची शिफारस' },
  correction: { en: 'Hours / Ticket / Transit Correction', mr: 'वेळ / तिकीट दुरुस्ती' },
  feature: { en: 'Platform Feature Suggestion', mr: 'नवीन फीचरची कल्पना' },
};

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || DEFAULT_EXPLORE_EMAIL;
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const pass = rawPass ? rawPass.trim().replace(/\s+/g, '') : '';

  if (pass) {
    if (host.includes('gmail') || user.includes('@gmail.com')) {
      // Use nodemailer's official built-in Gmail service configuration for optimal SSL/TLS & connection pooling
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    }

    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 12000,
      socketTimeout: 20000,
    });
  }

  return null;
}

export async function saveToEmailOutbox(type: string, to: string, subject: string, bodyText: string, metadata?: any) {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'sent-emails.json');
    let existing: any[] = [];
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(content);
    } catch {
      existing = [];
    }
    existing.unshift({
      id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      to,
      subject,
      preview: bodyText.slice(0, 400),
      metadata,
    });
    await fs.writeFile(filePath, JSON.stringify(existing.slice(0, 100), null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save to sent-emails.json outbox:', e);
  }
}

/**
 * 1. SENDS AUTOMATED CONFIRMATION & THANK-YOU EMAIL TO THE USER
 * Acknowledges their feedback, assures that issues will be investigated and resolved by the team,
 * and signs off from Suraj Dhok and Sahil Jadhav (ExplorePune Team).
 * Sender email: explorepune232@gmail.com, displayed as 'ExplorePune Team'.
 */
export async function sendFeedbackConfirmationEmail(params: FeedbackEmailParams) {
  const { toEmail, userName, rating, type, message, isMarathi } = params;
  if (!toEmail || !toEmail.includes('@')) {
    return { success: false, reason: 'Invalid recipient email' };
  }

  const categoryName = TYPE_LABELS[type] || { en: type, mr: type };
  const stars = '★'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - rating));

  const fromHeader = getExplorePuneFromHeader();

  const subject = isMarathi
    ? 'एक्सप्लोर पुणे वापरल्याबद्दल आणि अभिप्रायाबद्दल मनःपूर्वक धन्यवाद! 🙏 | ExplorePune Team'
    : 'Thank You for Using Explore Pune & Your Valuable Feedback! 🙏 | ExplorePune Team';

  const htmlContent = `
<!DOCTYPE html>
<html lang="${isMarathi ? 'mr' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    
    <!-- Top Decorative Header -->
    <div style="background: linear-gradient(135deg, #c2410c 0%, #d97706 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 38px; margin-bottom: 8px;">🚩</div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Explore Pune | एक्सप्लोर पुणे</h1>
      <p style="margin: 6px 0 0; font-size: 13.5px; opacity: 0.95; color: #fef08a;">पुणे आणि सह्याद्रीच्या ऐतिहासिक वाटा • Official Tourism & Heritage Guide</p>
    </div>

    <!-- Letter Body -->
    <div style="padding: 32px 26px;">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #c2410c; font-weight: 800;">
        ${isMarathi ? 'एक्सप्लोर पुणे वापरल्याबद्दल मनःपूर्वक धन्यवाद! 🙏' : 'Thank You for Using Explore Pune! 🙏'}
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px;">
        ${
          isMarathi
            ? `सस्नेह नमस्कार <strong>${userName || 'पर्यटक मित्र'}</strong>,`
            : `Dear <strong>${userName || 'Explorer'}</strong>,`
        }
      </p>

      <p style="font-size: 14.5px; line-height: 1.65; color: #334155; margin: 0 0 16px;">
        ${
          isMarathi
            ? 'एक्सप्लोर पुणे (Explore Pune) संकेतस्थळ वापरल्याबद्दल आणि आपला बहुमोल अभिप्राय नोंदवल्याबद्दल आम्ही आपले मनापासून आभारी आहोत.'
            : 'Thank you very much for using Explore Pune and taking the time to share your valuable feedback and experience with us.'
        }
      </p>

      <!-- Reassurance of resolving issue -->
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-left: 4px solid #16a34a; border-radius: 10px; padding: 16px 18px; margin: 18px 0;">
        <strong style="color: #15803d; font-size: 14px; display: block; margin-bottom: 6px;">
          🛠️ ${isMarathi ? 'तुमच्या अभिप्रायाची दखल आणि निराकरण:' : 'Our Commitment to Resolving Issues:'}
        </strong>
        <p style="font-size: 13.5px; line-height: 1.6; color: #166534; margin: 0;">
          ${
            isMarathi
              ? 'आमच्या एक्सप्लोर पुणे टीमने आपला संदेश स्वीकारला असून आम्ही त्याचा काळजीपूर्वक अभ्यास करत आहोत. आपण नमूद केलेली कोणतीही अडचण, चूक किंवा नवीन सुधारणा लवकरात लवकर सोडवण्यासाठी आमचे डेव्हलपर्स आणि रिसर्च टीम कार्यरत आहेत. यामुळे सर्व पुणेकरांना व पर्यटकांना अधिक अचूक माहिती मिळेल.'
              : 'Our ExplorePune team has received your message and is actively reviewing it. If you reported any issue, technical difficulty, or requested a correction, please be assured that our development team is on it and working hard to resolve it as quickly as possible.'
          }
        </p>
      </div>

      <!-- Feedback Details Box -->
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-left: 4px solid #c2410c; border-radius: 10px; padding: 18px 20px; margin: 20px 0;">
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
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
        <strong style="color: #92400e; font-size: 14px; display: block; margin-bottom: 6px;">
          💌 ${isMarathi ? 'संस्थापकांकडून संदेश:' : 'A Personal Note from the Team:'}
        </strong>
        <p style="font-size: 13.5px; line-height: 1.6; color: #78350f; margin: 0;">
          ${
            isMarathi
              ? 'आपल्या सहकार्यामुळे पुणे आणि सह्याद्रीच्या ऐतिहासिक वाटा जगातील प्रत्येक पर्यटकासाठी सोप्या आणि समृद्ध होत आहेत. पुन्हा एक्सप्लोर पुणेवर नक्की भेट द्या!'
              : 'We read every single feedback submission to ensure Explore Pune remains the most dependable, fact-checked, and authentic travel companion for everyone. Thank you for walking this path with us!'
          }
        </p>
      </div>

      <!-- Mandatory Signature from Suraj Dhok & Sahil Jadhav -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1.5px solid #e2e8f0;">
        <p style="font-size: 14px; margin: 0 0 4px; color: #64748b;">
          ${isMarathi ? 'सस्नेह नमस्कार,' : 'Warm regards,'}
        </p>
        <p style="font-size: 16.5px; font-weight: 800; color: #c2410c; margin: 0;">
          Suraj Dhok and Sahil Jadhav
        </p>
        <p style="font-size: 13px; font-weight: 700; color: #475569; margin: 3px 0 0;">
          ExplorePune Team
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11.5px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px;">
        Explore Pune • Verified Tourism, Sahyadri Trails & Transit Guide
      </p>
      <p style="margin: 0;">
        Sent with care by ExplorePune Team (explorepune232@gmail.com).
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Explore Pune | एक्सप्लोर पुणे
==================================================
${isMarathi ? 'एक्सप्लोर पुणे वापरल्याबद्दल मनःपूर्वक धन्यवाद! 🙏' : 'Thank You for Using Explore Pune! 🙏'}

${isMarathi ? `सस्नेह नमस्कार ${userName || 'पर्यटक मित्र'},` : `Dear ${userName || 'Explorer'},`}

${
  isMarathi
    ? 'एक्सप्लोर पुणे (Explore Pune) संकेतस्थळ वापरल्याबद्दल आणि आपला बहुमोल अभिप्राय नोंदवल्याबद्दल आम्ही आपले मनापासून आभारी आहोत.\n\nआमच्या एक्सप्लोर पुणे टीमने आपला संदेश स्वीकारला असून आम्ही त्याचा काळजीपूर्वक अभ्यास करत आहोत. आपण नमूद केलेली कोणतीही अडचण किंवा दुरुस्ती लवकरात लवकर सोडवण्यासाठी आमचे डेव्हलपर्स कार्यरत आहेत.'
    : 'Thank you very much for using Explore Pune and sharing your feedback with us.\n\nOur ExplorePune team has received your message and is actively reviewing it. If you reported any issue or suggested a correction, our team is on it and working hard to resolve it as quickly as possible.'
}

Feedback Details:
- Rating: ${rating}/5 (${stars})
- Category: ${categoryName.en}
- Message: "${message}"

Warm regards / सस्नेह नमस्कार,
Suraj Dhok and Sahil Jadhav
ExplorePune Team
==================================================
`;

  // Always record in local outbox
  await saveToEmailOutbox('user_feedback_thank_you', toEmail, subject, textContent, { rating, type });

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: toEmail,
        replyTo: DEFAULT_EXPLORE_EMAIL,
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

  // Graceful development / non-SMTP fallback
  console.log(
    `[Explore Pune Mailer] Automated thank-you email prepared for ${toEmail} from Suraj Dhok & Sahil Jadhav (ExplorePune Team).`
  );
  return { success: true, mode: 'simulated_fallback' };
}

/**
 * 2. SENDS AN EMAIL NOTIFICATION TO US (SURAJ DHOK & SAHIL JADHAV)
 * Whenever a user submits feedback, the admin team receives the complete feedback details.
 */
export async function sendFeedbackAdminNotificationEmail(params: FeedbackAdminNotificationParams) {
  const { userEmail, userName, userId, rating, type, message, feedbackId } = params;
  const adminEmail = process.env.ADMIN_FEEDBACK_EMAIL || DEFAULT_EXPLORE_EMAIL;

  const categoryName = TYPE_LABELS[type] || { en: type, mr: type };
  const stars = '★'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - rating));

  const fromHeader = getExplorePuneFromHeader();
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
      Explore Pune Admin Dispatcher • Delivered to ${adminEmail}
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

  // Always record in local outbox
  await saveToEmailOutbox('admin_feedback_notification', adminEmail, subject, textContent, { userEmail, rating, type, feedbackId });

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromHeader,
        to: adminEmail,
        replyTo: userEmail,
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

/**
 * 3. SENDS CUSTOM ITINERARY WITH ATTACHED PDF DIRECTLY TO USER'S EMAIL
 * Allows travelers in Trip Planner to receive their full schedule, transit routes, and PDF guide.
 * Sent from: ExplorePune Team <explorepune232@gmail.com>
 * Signed off: Suraj Dhok and Sahil Jadhav, ExplorePune Team
 */
export async function sendItineraryEmail(params: ItineraryEmailParams) {
  const { toEmail, userName, itineraryData, isMarathi } = params;
  if (!toEmail || !toEmail.includes('@')) {
    return { success: false, reason: 'Invalid recipient email address' };
  }

  const resolvedUserName =
    userName?.trim() ||
    itineraryData.userName?.trim() ||
    (toEmail ? toEmail.split('@')[0] : 'Explorer');

  itineraryData.userName = resolvedUserName;
  if (!itineraryData.userEmail) {
    itineraryData.userEmail = toEmail;
  }

  const fromHeader = getExplorePuneFromHeader();
  const planTitle = itineraryData.planTitle || 'Explore Pune Custom Plan';

  const subject = isMarathi
    ? `तुमचा सानुकूल पुणे सहल आराखडा: ${planTitle} 🗺️ | ${resolvedUserName} यांच्यासाठी ExplorePune टीमकडून`
    : `Your Custom Pune Itinerary: ${planTitle} 🗺️ | Prepared for ${resolvedUserName} by ExplorePune Team`;

  // Generate real PDF attachment buffer using jsPDF
  let pdfBuffer: Buffer | null = null;
  try {
    const doc = generateItineraryPdf(itineraryData);
    const arrayBuffer = doc.output('arraybuffer');
    pdfBuffer = Buffer.from(arrayBuffer);
  } catch (pdfErr: any) {
    console.warn('Could not generate PDF attachment for email:', pdfErr?.message || pdfErr);
  }

  const stopsHtml = (itineraryData.stops || [])
    .map((stop, i) => {
      const name = isMarathi && stop.nameMr ? stop.nameMr : stop.name;
      return `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="color: #c2410c; font-size: 15px;">
            ${i + 1}. ${name}
          </strong>
          <span style="background: #ffedd5; color: #9a3412; font-weight: 700; font-size: 11.5px; padding: 2px 8px; borderRadius: 999px;">
            ${stop.arrivalTime || 'Flexible'} - ${stop.departureTime || ''}
          </span>
        </div>
        <div style="font-size: 12.5px; color: #475569; margin-bottom: 4px;">
          ⏱️ <strong>${isMarathi ? 'थांबण्याची वेळ:' : 'Stay Duration:'}</strong> ${stop.visitMinutes} ${isMarathi ? 'मिनिटे' : 'mins'}
          ${stop.travelMinutes ? ` • 🚗 <strong>${isMarathi ? 'प्रवास वेळ:' : 'Travel:'}</strong> ${stop.travelMinutes} mins` : ''}
          ${stop.entryCost !== null ? ` • 🎟️ <strong>${isMarathi ? 'प्रवेश शुल्क:' : 'Entry:'}</strong> ₹${stop.entryCost}` : ''}
        </div>
        ${
          stop.transitSummary
            ? `<div style="font-size: 12px; color: #047857; background: #ecfdf5; padding: 6px 10px; border-radius: 6px; margin-top: 6px;">
                🚌 <strong>${isMarathi ? 'सार्वजनिक वाहतूक:' : 'Transit:'}</strong> ${stop.transitSummary}
              </div>`
            : ''
        }
      </div>
      `;
    })
    .join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="${isMarathi ? 'mr' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    
    <!-- Top Header Banner -->
    <div style="background: linear-gradient(135deg, #c2410c 0%, #d97706 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
      <div style="font-size: 38px; margin-bottom: 8px;">🗺️</div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">Explore Pune | Trip Planner</h1>
      <p style="margin: 6px 0 0; font-size: 13.5px; opacity: 0.95; color: #fef08a;">
        ${isMarathi ? 'पुणे सानुकूल सहल आराखडा आणि प्रवास मार्गदर्शक' : 'Your Custom Day Tour & Public Transit Itinerary'}
      </p>
    </div>

    <!-- Letter Body -->
    <div style="padding: 30px 26px;">
      <h2 style="margin: 0 0 14px; font-size: 20px; color: #c2410c; font-weight: 800;">
        ${itineraryData.badge || '⚡'} ${planTitle}
      </h2>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 14px;">
        ${
          isMarathi
            ? `सस्नेह नमस्कार <strong>${userName || 'पर्यटक मित्र'}</strong>,`
            : `Dear <strong>${userName || 'Explorer'}</strong>,`
        }
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px;">
        ${
          isMarathi
            ? 'एक्सप्लोर पुणे (Explore Pune) स्मार्ट सहल नियोजक वापरल्याबद्दल मनःपूर्वक धन्यवाद! तुमच्या निवडीनुसार तयार केलेला सहल आराखडा खालीलप्रमाणे आहे. तसेच या ईमेलसोबत संपूर्ण प्रिंट करण्यायोग्य **PDF फाईल जोडली आहे**, जी तुम्ही सहलीदरम्यान ऑफलाइन वापरू शकता!'
            : 'Thank you for planning your Pune adventure with Explore Pune! Below is your custom-tailored day plan with public transit guidance (Metro & PMPML bus lines). We have also **attached your official printable PDF itinerary** to this email for easy offline reference during your tour!'
        }
      </p>

      <!-- Overview Box -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b;">📍 <strong>${isMarathi ? 'सुरुवातीचे स्थान:' : 'Start Location:'}</strong></td>
            <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${itineraryData.startLocationName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">⏰ <strong>${isMarathi ? 'सुरुवात वेळ:' : 'Start Time:'}</strong></td>
            <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${itineraryData.startTime}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">⏱️ <strong>${isMarathi ? 'एकूण वेळ:' : 'Total Duration:'}</strong></td>
            <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">~${Math.round(itineraryData.totalDurationMinutes / 60)} ${isMarathi ? 'तास' : 'hours'} (${itineraryData.totalDurationMinutes} mins)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;">🎟️ <strong>${isMarathi ? 'अंदाजे खर्च:' : 'Estimated Cost:'}</strong></td>
            <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">₹${itineraryData.estimatedCost}</td>
          </tr>
        </table>
      </div>

      <!-- PDF Attachment Notice Pill -->
      <div style="background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 22px;">📎</span>
        <div style="font-size: 13px; color: #1e40af; line-height: 1.45;">
          <strong>${isMarathi ? 'संलग्न PDF फाईल:' : 'Attached PDF Document:'}</strong> ${isMarathi ? 'तुमची संपूर्ण सहल मार्गदर्शिका PDF या ईमेलसोबत संलग्न केली आहे (Explore_Pune_Itinerary.pdf).' : 'Your complete high-resolution itinerary PDF is attached to this email (Explore_Pune_Itinerary.pdf). Download or print it anytime!'}
        </div>
      </div>

      <!-- Stops Timeline -->
      <h3 style="font-size: 16px; color: #0f172a; margin: 20px 0 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
        📋 ${isMarathi ? 'सहल मार्ग व थांब्यांचे वेळापत्रक:' : 'Itinerary Route & Schedule:'}
      </h3>
      ${stopsHtml}

      <!-- Mandatory Signature from Suraj Dhok & Sahil Jadhav -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1.5px solid #e2e8f0;">
        <p style="font-size: 14px; margin: 0 0 4px; color: #64748b;">
          ${isMarathi ? 'सस्नेह नमस्कार,' : 'Warm regards,'}
        </p>
        <p style="font-size: 16.5px; font-weight: 800; color: #c2410c; margin: 0;">
          Suraj Dhok and Sahil Jadhav
        </p>
        <p style="font-size: 13px; font-weight: 700; color: #475569; margin: 3px 0 0;">
          ExplorePune Team
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11.5px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px;">
        Explore Pune • Verified Tourism, Sahyadri Trails & Transit Guide
      </p>
      <p style="margin: 0;">
        Sent on behalf of ExplorePune Team (explorepune232@gmail.com).
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Explore Pune | Itinerary Planner
==================================================
${planTitle}

${isMarathi ? `सस्नेह नमस्कार ${userName || 'पर्यटक मित्र'},` : `Dear ${userName || 'Explorer'},`}

Thank you for using Explore Pune! Your custom itinerary starting from ${itineraryData.startLocationName} at ${itineraryData.startTime} has been created.
Total Duration: ~${Math.round(itineraryData.totalDurationMinutes / 60)} hrs
Estimated Entry/Transit Cost: ₹${itineraryData.estimatedCost}

Stops:
${(itineraryData.stops || []).map((s, idx) => `${idx + 1}. ${s.name} (${s.arrivalTime} - ${s.departureTime}) - Stay: ${s.visitMinutes}m`).join('\n')}

Attached PDF:
We have attached your official PDF guide to this email (Explore_Pune_Itinerary.pdf).

Warm regards / सस्नेह नमस्कार,
Suraj Dhok and Sahil Jadhav
ExplorePune Team
==================================================
`;

  // Always record in local outbox
  await saveToEmailOutbox('itinerary_pdf_dispatch', toEmail, subject, textContent, { userName, planTitle, stopsCount: itineraryData.stops?.length });

  const transporter = getTransporter();

  if (transporter) {
    try {
      const safeUserName = resolvedUserName.replace(/[^a-zA-Z0-9]/g, '_');
      const attachments = pdfBuffer
        ? [
            {
              filename: `Explore_Pune_${safeUserName}_Itinerary.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ]
        : [];

      const info = await transporter.sendMail({
        from: fromHeader,
        to: toEmail,
        replyTo: DEFAULT_EXPLORE_EMAIL,
        subject,
        text: textContent,
        html: htmlContent,
        attachments,
      });

      return { success: true, messageId: info.messageId, mode: 'smtp', userName: resolvedUserName };
    } catch (err: any) {
      console.warn('Failed to send itinerary email via SMTP:', err?.message || err);
      return { success: false, error: err?.message, mode: 'smtp_failed', userName: resolvedUserName };
    }
  }

  // Graceful fallback
  console.log(
    `[Explore Pune Mailer] Itinerary email & PDF generated for ${toEmail} (${resolvedUserName}) from Suraj Dhok & Sahil Jadhav (ExplorePune Team).`
  );
  return { success: true, mode: 'simulated_fallback', userName: resolvedUserName };
}
