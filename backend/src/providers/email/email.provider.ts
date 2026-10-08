export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export interface IEmailProvider {
    send(options: EmailOptions): Promise<void>;
}
