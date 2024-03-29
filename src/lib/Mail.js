import nodemailer from 'nodemailer';
import { resolve } from 'path';

// yarn add express-handlebars nodemailer-express-handlebars

// exphbs
import expressHandle from 'express-handlebars';

// nodemailerhbs
import nodemailerHBS from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';




class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({ 
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
     });

     this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerHBS({
        viewEngine: expressHandle.create({  
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extname: '.hbs'
      }),
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();