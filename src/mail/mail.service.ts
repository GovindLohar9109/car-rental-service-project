import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const res = await this.mailerService.sendMail({
      to,
      subject,
      text,
      html,
    });
    console.log(to, subject, text, html);
  }
}
