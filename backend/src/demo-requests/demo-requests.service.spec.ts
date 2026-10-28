import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DemoRequestsService } from './demo-requests.service.js';
import { DemoRequestStatus, EmailStatus, PreferredTime } from './schemas/demo-request.schema.js';

describe('DemoRequestsService', () => {
  let service: DemoRequestsService;
  let mockDemoRequestModel: any;
  let mockWhatsAppService: any;
  let mockEmailService: any;

  beforeEach(() => {
    mockWhatsAppService = {
      notify: vi.fn().mockResolvedValue(undefined),
    };

    mockEmailService = {
      sendDemoNotification: vi.fn().mockResolvedValue({ success: true, messageId: 'msg_1' }),
    };

    function MockModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = 'mocked_id_123';
      this.save = vi.fn().mockResolvedValue(this);
    }
    MockModel.findById = vi.fn();
    MockModel.find = vi.fn();
    MockModel.countDocuments = vi.fn();
    MockModel.findByIdAndUpdate = vi.fn();

    mockDemoRequestModel = MockModel;

    service = new DemoRequestsService(
      mockDemoRequestModel as any,
      mockWhatsAppService as any,
      mockEmailService as any,
    );
  });

  it('should save demo request in MongoDB before sending email', async () => {
    const dto = {
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '9876543210',
      pgName: 'Happy PG',
      preferredDate: '2026-11-02',
      preferredTime: PreferredTime.MORNING,
      message: 'Demo inquiry',
    };

    const saved = await service.create(dto);
    expect(saved).toBeDefined();
    expect(saved?._id).toBe('mocked_id_123');
    expect(saved?.name).toBe('Test Customer');
    expect(saved?.email).toBe('customer@test.com');
    expect(saved?.status).toBe(DemoRequestStatus.NEW);
    expect(saved?.emailStatus).toBe(EmailStatus.PENDING);

    expect(mockEmailService.sendDemoNotification).toHaveBeenCalledWith(saved);
    expect(mockWhatsAppService.notify).toHaveBeenCalledWith(saved);
  });

  it('should preserve MongoDB record even if email notification throws an error', async () => {
    mockEmailService.sendDemoNotification.mockRejectedValue(new Error('Resend network outage'));

    const dto = {
      name: 'Resilient Customer',
      email: 'resilient@test.com',
      phone: '9876543210',
      preferredDate: '2026-11-03',
    };

    // Should not throw and saved record should still be returned
    const saved = await service.create(dto);
    expect(saved).toBeDefined();
    expect(saved?._id).toBe('mocked_id_123');
    expect(saved?.name).toBe('Resilient Customer');
  });

  it('should ignore submissions if honeypot is triggered', async () => {
    const dto = {
      name: 'Bot',
      email: 'bot@spam.com',
      phone: '9876543210',
      preferredDate: '2026-11-03',
      website: 'http://spam.org',
    };

    const result = await service.create(dto);
    expect(result).toBeNull();
    expect(mockEmailService.sendDemoNotification).not.toHaveBeenCalled();
  });
});
