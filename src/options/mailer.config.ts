import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';
import * as path from 'path';

config();

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
    },
  },
  // transport: process.env.SMTP_URL_TRANSPORT_OUTLOOK,
  transport: {
    host: process.env.SMTP_HOST_GOOGLE,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL_GOOGLE,
      pass: process.env.SMTP_PASS_GOOGLE,
    },
    //   // tls: {
    //   //   rejectUnauthorized: false,
    //   // },
    // },
    // transport:
    //   'smtps://e.shopping.adm01@gmail.com:pvpasrzrqxajzldg@smtp.domain.com',
  },
};

// transport: {
//   host: 'smtp.office365.com', SMTP_HOST_GOOGLE
//   port: '587',
//   secure: false,
//   auth: {
//     user: 'geovane.teste.dev@outlook.com', process.env.SMTP_EMAIL_GOOGLE
//     pass: 'SILVA00geovane', process.env.SMTP_PASS_GOOGLE
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// };
