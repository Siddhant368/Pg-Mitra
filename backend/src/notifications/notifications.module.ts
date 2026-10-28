import { Module } from '@nestjs/common';
import { WhatsAppAlertService } from './whatsapp-alert.service.js';
import { EmailNotificationService } from './email-notification.service.js';

@Module({
  providers: [WhatsAppAlertService, EmailNotificationService],
  exports: [WhatsAppAlertService, EmailNotificationService],
})
export class NotificationsModule {}
