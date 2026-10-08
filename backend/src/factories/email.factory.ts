import { NodemailerProvider } from '../providers/email/nodemailer.provider.js';
import type { IEmailProvider } from '../providers/email/email.provider.js';

export type EmailProvider = 'nodemailer';

export function createEmailProvider(
    provider: EmailProvider = 'nodemailer',
): IEmailProvider {
    switch (provider) {
        case 'nodemailer':
            return new NodemailerProvider();

        default:
            throw new Error(`Unsupported email provider: ${provider}`);
    }
}
