import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { EmailNotificationService } from './email-notification.service.js';
import { EmailStatus } from '../demo-requests/schemas/demo-request.schema.js';

describe('EmailNotificationService', () => {
  let service: EmailNotificationService;
  let mockConfigService: any;

  beforeEach(() => {
    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'RESEND_API_KEY') return 're_test_key_123';
        if (key === 'DEMO_NOTIFICATION_EMAIL') return 'admin@pgmitra.com';
        if (key === 'DEMO_FROM_EMAIL') return 'PG Mitra <onboarding@resend.dev>';
        return undefined;
      }),
    };
    service = new EmailNotificationService(mockConfigService as ConfigService);
  });

  it('should handle missing environment configuration gracefully', async () => {
    mockConfigService.get = vi.fn().mockReturnValue(undefined);
    const mockRequest = {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      updateOne: vi.fn().mockResolvedValue({}),
    };

    const result = await service.sendDemoNotification(mockRequest);
    expect(result.success).toBe(false);
    expect(result.error).toContain('missing RESEND_API_KEY or DEMO_NOTIFICATION_EMAIL');
    expect(mockRequest.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({
        emailStatus: EmailStatus.FAILED,
      }),
    );
  });

  it('should send email successfully and update status to SENT', async () => {
    const mockSend = vi.fn().mockResolvedValue({
      data: { id: 'msg_resend_12345' },
      error: null,
    });

    (service as any).resendClient = {
      emails: {
        send: mockSend,
      },
    };

    const mockRequest = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      pgName: 'Sunny PG',
      city: 'Bengaluru',
      approxBeds: 40,
      preferredDate: '2026-11-01',
      preferredTime: 'EVENING',
      message: 'Looking for a demo on bed management',
      updateOne: vi.fn().mockResolvedValue({}),
    };

    const result = await service.sendDemoNotification(mockRequest);
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('msg_resend_12345');
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'PG Mitra <onboarding@resend.dev>',
        to: ['admin@pgmitra.com'],
        replyTo: 'jane@example.com',
        subject: 'New PG Mitra Demo Request — Jane Smith',
      }),
    );
    expect(mockRequest.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({
        emailStatus: EmailStatus.SENT,
        emailMessageId: 'msg_resend_12345',
      }),
    );
  });

  it('should handle Resend API failure gracefully and mark status as FAILED', async () => {
    const mockSend = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'Domain verification required or testing email limit exceeded' },
    });

    (service as any).resendClient = {
      emails: {
        send: mockSend,
      },
    };

    const mockRequest = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543210',
      updateOne: vi.fn().mockResolvedValue({}),
    };

    const result = await service.sendDemoNotification(mockRequest);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Domain verification required');
    expect(mockRequest.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({
        emailStatus: EmailStatus.FAILED,
        emailError: expect.stringContaining('Domain verification required'),
      }),
    );
  });

  it('should safely escape HTML in user inputs', async () => {
    let capturedHtml = '';
    const mockSend = vi.fn().mockImplementation((options) => {
      capturedHtml = options.html;
      return Promise.resolve({ data: { id: 'msg_1' }, error: null });
    });

    (service as any).resendClient = {
      emails: {
        send: mockSend,
      },
    };

    const mockRequest = {
      _id: '507f1f77bcf86cd799439011',
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      phone: '9876543210',
      pgName: '<b>Hacked PG</b>',
      message: '<img src=x onerror=alert(1)>',
      updateOne: vi.fn().mockResolvedValue({}),
    };

    await service.sendDemoNotification(mockRequest);
    expect(capturedHtml).not.toContain('<script>');
    expect(capturedHtml).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(capturedHtml).not.toContain('<b>Hacked PG</b>');
    expect(capturedHtml).toContain('&lt;b&gt;Hacked PG&lt;/b&gt;');
    expect(capturedHtml).toContain('&lt;img src=x onerror=alert(1)&gt;');
  });
});
