import { BaseService } from './BaseService'
import { Inject, Service } from './Service'
import { Logger } from '/@main/logger'
import nodemailer from 'nodemailer';

export class EmailService extends Service {
  @Inject('BaseService')
  private baseService!: BaseService

  private transporter: any
  private mailConfig: { server: object; from: string; to: string; } | undefined
  private isReady: boolean = false

  constructor(logger: Logger, config: { server: object, from: string, to: string }) {
    super(logger);
    logger.log('Email service initialized ', JSON.stringify(config));
    if (config) {
      this.transporter = nodemailer.createTransport(config.server);
      this.mailConfig = config;
      this.isTransporterReady(this.transporter).then((ready) => {
        this.isReady = ready;
      });
    }
  }

  async isTransporterReady(transporter: nodemailer.Transporter): Promise<boolean> {
    try {
      await transporter.verify();
      console.log('Transporter configuration is valid');
      return true;
    } catch (error) {
      console.error('Transporter configuration is invalid:', error);
      return false;
    }
  }

  /**
   * Example for inject and shared lib
   */
  async sendEmail(to: string, subject: string, text: string, html?: string, attachment?: { filename: string, content: ArrayBuffer }) {
    console.log('Sending email to %s with subject %s', to, subject);
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }
    const mailOptions = {
      from: this.mailConfig?.from, // Replace with your sender details
      to: to || this.mailConfig?.to,
      subject,
      text,
      html,
      attachments: [] as any
    };

    if (attachment) {
      mailOptions.attachments = [{
        filename: attachment.filename,
        content: Buffer.from(attachment.content)
      }]
    }
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email: %s', error);
      throw error;
    }
  }

  ready() {
    console.log('checking Email service readiness:', this.isReady);
    return this.isReady;
  }
}
