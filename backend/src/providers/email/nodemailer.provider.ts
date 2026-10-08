import { type Transporter } from 'nodemailer';

import type { IEmailProvider, EmailOptions } from './email.provider.js';
import { transport } from '../../lib/nodemailer.js';
import env from '../../config/env.js';

export class NodemailerProvider implements IEmailProvider {
    private readonly transporter: Transporter;

    constructor() {
        this.transporter = transport;
    }

    async send(options: EmailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
    }
}
