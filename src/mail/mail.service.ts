import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TemplateRenderer } from './template.renderer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    TemplateRenderer.init();
  }

  private transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true, // ОБЯЗАТЕЛЬНО для Mail.ru
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD, // пароль внешнего приложения!
    },
  });

  async sendConfirmationCode(email: string, code: string) {
    const html = TemplateRenderer.render('confirmation', {
      name: email,
      code,
      ttl: 10,
    });

    await this.sendMail(email, 'Подтверждение регистрации', html);
  }


  async sendResetPassword(email: string, link: string) {
    const html = TemplateRenderer.render('reset-password', { link });

    await this.sendMail(email, 'Сброс пароля', html);
  }


  private async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"My App" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error('Mail send failed', error);
      throw error;
    }
  }
}
