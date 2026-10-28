import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailStatus } from '../demo-requests/schemas/demo-request.schema.js';

function escapeHtml(unsafe: any): string {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeText(value: any): string {
  if (value === null || value === undefined) return '-';
  const str = String(value).trim();
  return str.length > 0 ? str : '-';
}

function formatPreferredDay(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== 'string') return '-';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [, y, m, d] = match;
  const dateObj = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return dateStr;
  }
}

function formatSubmissionTime(date?: Date | string | null): string {
  const d = date ? new Date(date) : new Date();
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d) + ' IST';
  } catch {
    return d.toISOString();
  }
}

@Injectable()
export class EmailNotificationService implements OnModuleInit {
  private readonly logger = new Logger(EmailNotificationService.name);
  private resendClient: Resend | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.checkConfigAndInit();
  }

  /**
   * Diagnostic check for Resend configuration.
   * Reports missing variables clearly without exposing sensitive values.
   */
  private checkConfigAndInit(): boolean {
    const apiKey = this.configService.get<string>('RESEND_API_KEY')?.trim();
    const adminEmail = this.configService.get<string>('DEMO_NOTIFICATION_EMAIL')?.trim();
    const fromEmail = this.configService.get<string>('DEMO_FROM_EMAIL')?.trim();

    const missing: string[] = [];
    if (!apiKey) missing.push('RESEND_API_KEY');
    if (!adminEmail) missing.push('DEMO_NOTIFICATION_EMAIL');
    if (!fromEmail) missing.push('DEMO_FROM_EMAIL');

    if (missing.length > 0) {
      this.logger.warn(
        `EmailNotificationService: Missing required environment variable(s): ${missing.join(', ')}. Demo request email notifications will be skipped or marked as failed.`,
      );
      this.resendClient = null;
      return false;
    }

    try {
      this.resendClient = new Resend(apiKey);
      this.logger.log('EmailNotificationService initialized with Resend provider.');
      return true;
    } catch (err: any) {
      this.logger.error(`EmailNotificationService initialization failed: ${err?.message}`);
      this.resendClient = null;
      return false;
    }
  }

  /**
   * Sends demo notification email to the configured admin email address.
   * Gracefully updates DemoRequest document with email status.
   */
  async sendDemoNotification(request: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const reqId = request?._id?.toString?.() || request?.id?.toString?.() || 'unknown';

    const apiKey = this.configService.get<string>('RESEND_API_KEY')?.trim();
    const adminEmail = this.configService.get<string>('DEMO_NOTIFICATION_EMAIL')?.trim();
    const fromEmail = this.configService.get<string>('DEMO_FROM_EMAIL')?.trim() || 'PG Mitra <onboarding@resend.dev>';

    // Validate environment configuration
    if (!apiKey || !adminEmail) {
      const errorMsg = 'Email service misconfigured: missing RESEND_API_KEY or DEMO_NOTIFICATION_EMAIL';
      this.logger.warn(`${errorMsg} for demo request ${reqId}`);
      await this.recordEmailStatus(request, EmailStatus.FAILED, errorMsg);
      return { success: false, error: errorMsg };
    }

    if (!this.resendClient) {
      this.resendClient = new Resend(apiKey);
    }

    const customerName = sanitizeText(request?.name);
    const customerEmail = String(request?.email || '').trim().toLowerCase();
    const phone = sanitizeText(request?.phone);
    const pgName = sanitizeText(request?.pgName || request?.companyName);
    const city = sanitizeText(request?.city);
    const approxBeds = request?.approxBeds ? String(request.approxBeds) : '-';
    const preferredDate = formatPreferredDay(request?.preferredDate);
    const preferredTime = sanitizeText(request?.preferredTime);
    const message = sanitizeText(request?.message);
    const submissionTime = formatSubmissionTime(request?.createdAt);

    const subject = `New PG Mitra Demo Request — ${customerName}`;

    // Plain text content
    const textContent = [
      '========================================',
      '      NEW PG MITRA DEMO REQUEST',
      '========================================',
      '',
      `Customer Name:       ${customerName}`,
      `Email Address:       ${customerEmail}`,
      `Phone Number:        ${phone}`,
      `PG / Company Name:   ${pgName}`,
      `City:                ${city}`,
      `Approximate Beds:    ${approxBeds}`,
      `Preferred Demo Date: ${preferredDate} (${request?.preferredDate || '-'})`,
      `Preferred Time:      ${preferredTime}`,
      `Message / Notes:     ${message}`,
      '',
      '----------------------------------------',
      `Request ID:          ${reqId}`,
      `Submission Time:     ${submissionTime}`,
      '----------------------------------------',
      '',
      `Reply-To: ${customerEmail}`,
      `WhatsApp: https://wa.me/91${phone.replace(/\\D/g, '')}`,
    ].join('\n');

    // Safe escaped HTML content
    const escName = escapeHtml(customerName);
    const escEmail = escapeHtml(customerEmail);
    const escPhone = escapeHtml(phone);
    const escPg = escapeHtml(pgName);
    const escCity = escapeHtml(city);
    const escBeds = escapeHtml(approxBeds);
    const escDate = escapeHtml(preferredDate);
    const escRawDate = escapeHtml(request?.preferredDate || '');
    const escTime = escapeHtml(preferredTime);
    const escMessage = escapeHtml(message);
    const escReqId = escapeHtml(reqId);
    const escSubmissionTime = escapeHtml(submissionTime);
    const cleanPhoneDigits = phone.replace(/\D/g, '');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F4F1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #242624;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F5F4F1; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #E7E4DD; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #052E26 0%, #0F766E 100%); padding: 28px 24px; text-align: left;">
              <span style="display: inline-block; background-color: rgba(52, 211, 153, 0.2); color: #34D399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 12px; margin-bottom: 12px;">
                New Demo Submission
              </span>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                Demo Request from ${escName}
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #EAF4F3;">
                PG Mitra Management Platform
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px;">
              
              <!-- Quick Action Bar -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-right: 8px;">
                    <a href="mailto:${escEmail}" style="display: block; text-align: center; background-color: #0F766E; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 16px; border-radius: 8px;">
                      Reply via Email
                    </a>
                  </td>
                  ${cleanPhoneDigits ? `
                  <td style="padding-left: 8px;">
                    <a href="https://wa.me/91${cleanPhoneDigits}" target="_blank" style="display: block; text-align: center; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 16px; border-radius: 8px;">
                      Chat on WhatsApp
                    </a>
                  </td>` : ''}
                </tr>
              </table>

              <!-- Customer Details -->
              <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #0F766E; margin: 0 0 12px; font-weight: 700;">
                Customer & Property Details
              </h2>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; width: 38%; font-weight: 500;">Customer Name</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">Email Address</td>
                  <td style="padding: 10px 0; color: #0F766E; font-weight: 600;">
                    <a href="mailto:${escEmail}" style="color: #0F766E; text-decoration: none;">${escEmail}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">Phone Number</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escPhone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">PG / Company Name</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escPg}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">City</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escCity}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">Approx. Beds</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escBeds}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">Preferred Demo Date</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escDate} <span style="color: #8892A4; font-weight: 400; font-size: 12px;">(${escRawDate})</span></td>
                </tr>
                <tr style="border-bottom: 1px solid #F0EEE9;">
                  <td style="padding: 10px 0; color: #526078; font-weight: 500;">Preferred Time Slot</td>
                  <td style="padding: 10px 0; color: #242624; font-weight: 600;">${escTime}</td>
                </tr>
              </table>

              <!-- Customer Message Box (if present) -->
              ${message !== '-' ? `
              <div style="background-color: #F8F9FA; border-left: 4px solid #0F766E; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #526078;">
                  Customer Message / Notes:
                </p>
                <p style="margin: 0; font-size: 14px; color: #242624; white-space: pre-wrap; line-height: 1.5;">${escMessage}</p>
              </div>` : ''}

              <!-- Metadata Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF9F5; border-radius: 8px; border: 1px solid #E7E4DD; padding: 12px 16px; font-size: 12px; color: #526078;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Request ID:</strong> <code style="font-family: monospace; color: #242624;">${escReqId}</code></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Submitted At:</strong> ${escSubmissionTime}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Reply-To:</strong> ${escEmail}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F5F4F1; border-top: 1px solid #E7E4DD; padding: 16px 24px; text-align: center; font-size: 12px; color: #8892A4;">
              This notification was generated automatically by PG Mitra Demo Requests system.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    try {
      const emailOptions: any = {
        from: fromEmail,
        to: [adminEmail],
        replyTo: customerEmail || undefined,
        reply_to: customerEmail || undefined,
        subject,
        text: textContent,
        html: htmlContent,
      };

      const result = await this.resendClient.emails.send(emailOptions);

      if (result.error) {
        const errorMsg = result.error.message || 'Resend error';
        this.logger.error(`Resend email delivery FAILED for demo request ${reqId}: ${errorMsg}`);
        await this.recordEmailStatus(request, EmailStatus.FAILED, errorMsg);
        return { success: false, error: errorMsg };
      }

      const messageId = result.data?.id;
      this.logger.log(`Resend demo email SENT successfully for request ${reqId} (Message ID: ${messageId || 'ok'})`);
      await this.recordEmailStatus(request, EmailStatus.SENT, undefined, messageId);
      return { success: true, messageId };
    } catch (err: any) {
      const errorMsg = err?.message || 'Network / SDK exception';
      this.logger.error(`Exception while sending demo email for request ${reqId}: ${errorMsg}`);
      await this.recordEmailStatus(request, EmailStatus.FAILED, errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Records email status safely in the MongoDB document.
   */
  private async recordEmailStatus(
    request: any,
    status: EmailStatus,
    error?: string,
    messageId?: string,
  ): Promise<void> {
    if (!request) return;

    const update: any = {
      emailStatus: status,
    };
    if (status === EmailStatus.SENT) {
      update.emailSentAt = new Date();
      update.emailError = null;
    }
    if (error) {
      update.emailError = String(error).slice(0, 500);
    }
    if (messageId) {
      update.emailMessageId = String(messageId);
    }

    // Update in-memory object
    request.emailStatus = update.emailStatus;
    if (update.emailSentAt) request.emailSentAt = update.emailSentAt;
    if (update.emailError !== undefined) request.emailError = update.emailError;
    if (update.emailMessageId) request.emailMessageId = update.emailMessageId;

    try {
      if (typeof request.updateOne === 'function') {
        await request.updateOne(update);
      } else if (typeof request.save === 'function') {
        await request.save();
      }
    } catch (err: any) {
      this.logger.error(`Failed to record email status in DB for demo request: ${err?.message}`);
    }
  }
}
