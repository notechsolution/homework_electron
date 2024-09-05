import { BaseService } from './BaseService'
import { Inject, Service } from './Service'
import { Logger } from '/@main/logger'
import nodemailer from 'nodemailer';

export class EmailService extends Service {
  @Inject('BaseService')
  private baseService!: BaseService

  private transporter: any

  constructor(logger: Logger) {
    super(logger);

  }

  /**
   * Example for inject and shared lib
   */
  async sendEmail(to: string, subject: string, text: string, html?: string, attachment?: { filename: string, content: ArrayBuffer }[]) {
    console.log('Sending email to %s with subject %s', to, subject);
    const mailOptions = {
      from: 'lezhi.zeng@163.com', // Replace with your sender details
      to,
      subject,
      text,
      html,
      attachments: [{
        filename: attachment?.filename,
        content: Buffer.from(attachment?.content)
      }]
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email: %s', error);
      throw error;
    }
  }
}
