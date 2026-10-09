import { render } from 'react-email';
import { createElement } from 'react';
import type { IEmailProvider } from '../providers/email/email.provider.js';
import { WelcomeAndVerifyEmail } from '../templates/email/welcome-with-verify-email.js';
import { ForgotPasswordEmail } from '../templates/email/forgot-password.js';

export default class EmailService {
    constructor(private readonly emailProvider: IEmailProvider) {}

    async sendWelcomeAndVerifyEmail(
        email: string,
        name: string,
        otp: string,
    ): Promise<void> {
        const html = await render(
            createElement(WelcomeAndVerifyEmail, {
                name,
                otp,
            }),
        );
        await this.emailProvider.send({
            to: email,
            subject: 'Welcome to CINEZA — Verify your email',
            html,
        });
    }

    async sendForgotPasswordOtp(email: string, otp: string): Promise<void> {
        const html = await render(
            createElement(ForgotPasswordEmail, { otp, expiresInMinutes: 15 }),
        );
        await this.emailProvider.send({
            to: email,
            subject: 'Your CINEZA password reset code',
            html,
        });
    }
}
