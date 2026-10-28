import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DemoRequest,
  DemoRequestDocument,
  DemoRequestStatus,
  EmailStatus,
  PreferredTime,
} from './schemas/demo-request.schema.js';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto.js';
import { UpdateDemoRequestStatusDto } from './dto/update-demo-request.dto.js';
import { WhatsAppAlertService } from '../notifications/whatsapp-alert.service.js';
import { EmailNotificationService } from '../notifications/email-notification.service.js';

@Injectable()
export class DemoRequestsService {
  private readonly logger = new Logger(DemoRequestsService.name);

  constructor(
    @InjectModel(DemoRequest.name) private demoRequestModel: Model<DemoRequestDocument>,
    private readonly whatsAppAlertService: WhatsAppAlertService,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  async create(createDto: CreateDemoRequestDto): Promise<DemoRequestDocument | null> {
    // Honeypot check: hidden honeypot field "website" that must be empty
    if (createDto.website && createDto.website.trim() !== '') {
      this.logger.warn('Honeypot triggered in demo request submission. Request discarded silently.');
      return null;
    }

    const { website, companyName, ...rest } = createDto;
    const dataToSave = {
      ...rest,
      pgName: rest.pgName || companyName || undefined,
      preferredTime: rest.preferredTime || PreferredTime.EVENING,
      status: DemoRequestStatus.NEW,
      emailStatus: EmailStatus.PENDING,
    };

    // 1. Save to MongoDB BEFORE email delivery attempt
    const newReq = new this.demoRequestModel(dataToSave);
    const saved = await newReq.save();
    this.logger.log(`Demo request created and saved to MongoDB with ID: ${saved._id}`);

    // 2. Email Notification using Resend
    try {
      await this.emailNotificationService.sendDemoNotification(saved);
    } catch (err: any) {
      // Safe error handling: Keep MongoDB record intact and log safe diagnostic
      this.logger.error(`Gracefully caught email notification error for demo request ${saved._id}: ${err?.message}`);
    }

    // 3. Optional WhatsApp notification
    void this.whatsAppAlertService.notify(saved).catch(() => {});

    return saved;
  }

  async retryEmail(id: string) {
    const request = await this.demoRequestModel.findById(new Types.ObjectId(id)).exec();
    if (!request) {
      throw new NotFoundException('Demo request not found');
    }

    const result = await this.emailNotificationService.sendDemoNotification(request);
    const reloaded = await this.demoRequestModel.findById(new Types.ObjectId(id)).exec();
    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      request: reloaded,
    };
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: DemoRequestStatus;
    emailStatus?: EmailStatus;
    date?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.emailStatus) {
      filter.emailStatus = query.emailStatus;
    }
    if (query.date) {
      filter.preferredDate = query.date;
    }

    const [data, total] = await Promise.all([
      this.demoRequestModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.demoRequestModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(id: string, updateDto: UpdateDemoRequestStatusDto) {
    const updated = await this.demoRequestModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { status: updateDto.status },
      { new: true },
    ).exec();
    if (!updated) {
      throw new NotFoundException('Demo request not found');
    }
    return updated;
  }
}
