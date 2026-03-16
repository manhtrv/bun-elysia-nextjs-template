import { enqueueJob } from '@/services/redis';

export interface EmailJob {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export async function sendEmail(emailData: EmailJob) {
  await enqueueJob('email:queue', emailData);
}

export interface NotificationJob {
  userId: number;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export async function sendNotification(notificationData: NotificationJob) {
  await enqueueJob('notification:queue', notificationData);
}
