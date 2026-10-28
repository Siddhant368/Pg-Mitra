import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotifyStatus } from '../demo-requests/schemas/demo-request.schema.js';

function sanitize(value: any): string {
  if (value === null || value === undefined) return '-';
  let str = String(value).trim();
  if (!str) return '-';
  str = str.replace(/[\r\n\t]+/g, ' ');
  str = str.replace(/\s+/g, ' ').trim();
  if (!str) return '-';
  if (str.length > 100) {
    str = str.slice(0, 100);
  }
  return str;
}

function formatPreferredDay(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== 'string') return '-';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return sanitize(dateStr);
  const [, y, m, d] = match;
  const dateObj = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return sanitize(dateStr);
  }
}

function formatPreferredTime(timeStr?: string): string {
  if (!timeStr || typeof timeStr !== 'string') return '-';
  const lower = timeStr.trim().toLowerCase();
  if (lower === 'morning') return 'Morning';
  if (lower === 'afternoon') return 'Afternoon';
  if (lower === 'evening') return 'Evening';
  return sanitize(timeStr);
}

@Injectable()
export class WhatsAppAlertService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppAlertService.name);
  private lastAlertTimestamp = 0;
  private alertTimestampsPastHour: number[] = [];

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const enabled = this.configService.get<string>('ALERT_WHATSAPP_ENABLED');
    const number = this.configService.get<string>('ALERT_WHATSAPP_NUMBER');
    const apiKey = this.configService.get<string>('CALLMEBOT_API_KEY');

    const trimmedNumber = (number || '').trim();
    const trimmedKey = (apiKey || '').trim();
    const isEnabled = enabled === 'true';
    const isValidNumber = /^\d{10,15}$/.test(trimmedNumber);
    const hasKey = trimmedKey.length > 0;

    if (!isEnabled || !isValidNumber || !hasKey) {
      this.logger.warn('WhatsApp alert service is disabled or misconfigured');
    }
  }

  async notify(request: any): Promise<void> {
    const reqId = request?._id?.toString?.() || request?.id?.toString?.() || 'unknown';

    const enabled = this.configService.get<string>('ALERT_WHATSAPP_ENABLED');
    const number = this.configService.get<string>('ALERT_WHATSAPP_NUMBER');
    const apiKey = this.configService.get<string>('CALLMEBOT_API_KEY');

    const trimmedNumber = (number || '').trim();
    const trimmedKey = (apiKey || '').trim();
    const isEnabled = enabled === 'true';
    const isValidNumber = /^\d{10,15}$/.test(trimmedNumber);
    const hasKey = trimmedKey.length > 0;

    if (!isEnabled || !isValidNumber || !hasKey) {
      // Skip silently
      await this.recordStatus(request, NotifyStatus.SKIPPED);
      return;
    }

    const now = Date.now();
    if (now - this.lastAlertTimestamp < 1000) {
      await this.recordStatus(request, NotifyStatus.SKIPPED, 'rate limited');
      this.logger.warn(`WhatsApp alert SKIPPED (rate limited) for demo request ${reqId}`);
      return;
    }

    this.alertTimestampsPastHour = this.alertTimestampsPastHour.filter((t) => now - t < 3600000);
    if (this.alertTimestampsPastHour.length >= 30) {
      await this.recordStatus(request, NotifyStatus.SKIPPED, 'rate limited');
      this.logger.warn(`WhatsApp alert SKIPPED (rate limited) for demo request ${reqId}`);
      return;
    }

    this.lastAlertTimestamp = now;
    this.alertTimestampsPastHour.push(now);

    const cleanPhone = sanitize(request.phone);
    const textLines = [
      'New demo request on PGMitra',
      `Name: ${sanitize(request.name)}`,
      `Phone: ${cleanPhone}`,
      `PG: ${sanitize(request.pgName)}`,
      `City: ${sanitize(request.city)}`,
      `Beds: ${sanitize(request.approxBeds)}`,
      `Preferred day: ${sanitize(formatPreferredDay(request.preferredDate))}`,
      `Best time to call: ${sanitize(formatPreferredTime(request.preferredTime))}`,
      `Chat: https://wa.me/91${cleanPhone}`,
    ];
    const messageText = textLines.join('\n');

    const params = new URLSearchParams({
      phone: trimmedNumber,
      text: messageText,
      apikey: trimmedKey,
    });
    const url = new URL('https://api.callmebot.com/whatsapp.php');
    url.search = params.toString();

    let attempt = await this.executeCallMeBot(url);
    if (!attempt.success && attempt.canRetry) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      attempt = await this.executeCallMeBot(url);
    }

    if (attempt.success) {
      await this.recordStatus(request, NotifyStatus.SENT);
      this.logger.log(`WhatsApp alert SENT for demo request ${reqId}`);
    } else {
      const reason = (attempt.reason || 'failed').slice(0, 200);
      await this.recordStatus(request, NotifyStatus.FAILED, reason);
      this.logger.error(`WhatsApp alert FAILED (${reason}) for demo request ${reqId}`);
    }
  }

  private async executeCallMeBot(
    url: URL,
  ): Promise<{ success: boolean; reason?: string; canRetry?: boolean }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      if (res.status === 429) {
        return { success: false, reason: 'HTTP 429', canRetry: true };
      }
      if (res.status >= 500 && res.status < 600) {
        return { success: false, reason: `HTTP ${res.status}`, canRetry: true };
      }
      if (!res.ok) {
        return { success: false, reason: `HTTP ${res.status}`, canRetry: false };
      }

      const body = await res.text();
      if (/error|invalid|fail/i.test(body)) {
        return { success: false, reason: 'CallMeBot error', canRetry: false };
      }

      return { success: true };
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        return { success: false, reason: 'timeout', canRetry: true };
      }
      return { success: false, reason: 'network error', canRetry: true };
    } finally {
      clearTimeout(timer);
    }
  }

  private async recordStatus(
    request: any,
    status: NotifyStatus,
    error?: string,
  ): Promise<void> {
    const update: any = {
      notifyStatus: status,
      notifiedAt: new Date(),
    };
    if (error) {
      update.notifyError = error.slice(0, 200);
    }

    if (!request) return;

    request.notifyStatus = update.notifyStatus;
    request.notifiedAt = update.notifiedAt;
    if (error) {
      request.notifyError = update.notifyError;
    }

    if (typeof request.updateOne === 'function') {
      try {
        await request.updateOne(update);
      } catch (err: any) {
        this.logger.error(`Failed to update notify status for request: ${err?.message}`);
      }
    } else if (typeof request.save === 'function') {
      try {
        await request.save();
      } catch (err: any) {
        this.logger.error(`Failed to save notify status for request: ${err?.message}`);
      }
    }
  }
}
