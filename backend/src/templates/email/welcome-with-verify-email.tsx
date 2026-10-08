import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from 'react-email';

interface WelcomeAndVerifyEmailProps {
    name?: string;
    otp?: string;
    expiresInMinutes?: number;
}

const COMPANY_NAME = 'CINEZA';

export const WelcomeAndVerifyEmail = ({
    name = 'there',
    otp = '123456',
    expiresInMinutes = 10,
}: WelcomeAndVerifyEmailProps) => {
    return (
        <Html lang="en">
            <Tailwind>
                <Head />

                <Preview>Your Cineza verification code is {otp}</Preview>

                <Body className="m-0 bg-[#f4f4f5] font-sans">
                    <Container className="mx-auto w-full max-w-[560px] px-4 py-8 sm:px-6">
                        {/* ================= HEADER ================= */}

                        <Section className="rounded-t-[12px] bg-[#111111] px-7 py-6 sm:px-9">
                            <Text
                                className="m-0 text-[20px] font-bold tracking-[-0.5px] text-white"
                                style={{
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                }}
                            >
                                <span className="mr-2 text-[#e50914]">◈</span>
                                {COMPANY_NAME}
                            </Text>
                        </Section>

                        {/* ================= MAIN ================= */}

                        <Section className="bg-white px-7 py-9 sm:px-9 sm:py-10">
                            {/* Small status */}

                            <Text className="m-0 text-[11px] font-bold uppercase tracking-[2px] text-[#e50914]">
                                Email verification
                            </Text>

                            {/* Heading */}

                            <Heading
                                className="m-0 mt-3 text-[28px] font-bold leading-[34px] tracking-[-0.8px] text-[#111111]"
                                style={{
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                }}
                            >
                                Welcome to Cineza, {name}.
                            </Heading>

                            {/* Description */}

                            <Text className="m-0 mt-4 text-[15px] leading-[24px] text-[#555555]">
                                Thanks for creating your account. Verify your
                                email address to finish setting up your Cineza
                                account.
                            </Text>

                            {/* ================= OTP ================= */}

                            <Section className="mt-8 rounded-[10px] border border-[#e5e5e5] bg-[#fafafa] px-5 py-7">
                                <Text className="m-0 text-center text-[10px] font-bold uppercase tracking-[2px] text-[#888888]">
                                    Verification code
                                </Text>

                                <Text
                                    className="m-0 mt-4 text-center text-[38px] font-bold tracking-[8px] text-[#111111]"
                                    style={{
                                        fontFamily:
                                            'Arial, Helvetica, sans-serif',
                                    }}
                                >
                                    {otp}
                                </Text>

                                <Text className="m-0 mt-4 text-center text-[12px] leading-[18px] text-[#777777]">
                                    This code expires in{' '}
                                    <strong className="text-[#333333]">
                                        {expiresInMinutes} minutes
                                    </strong>
                                </Text>
                            </Section>

                            {/* ================= ACTION ================= */}

                            <Section className="mt-8">
                                <Text className="m-0 text-[14px] leading-[22px] text-[#555555]">
                                    Enter this code on the Cineza verification
                                    screen to activate your account.
                                </Text>
                            </Section>

                            {/* ================= SECURITY ================= */}

                            <Section className="mt-7 border-t border-[#eeeeee] pt-6">
                                <Text className="m-0 text-[12px] leading-[20px] text-[#777777]">
                                    <strong className="text-[#333333]">
                                        Didn't request this?
                                    </strong>{' '}
                                    You can safely ignore this email. Your
                                    account will not be verified without the
                                    code.
                                </Text>
                            </Section>
                        </Section>

                        {/* ================= BRAND STRIP ================= */}

                        <Section className="bg-[#111111] px-7 py-7 sm:px-9">
                            <Text
                                className="m-0 text-[13px] font-medium leading-[20px] text-[#ffffff]"
                                style={{
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                }}
                            >
                                Your next movie night starts here.
                            </Text>

                            <Text className="m-0 mt-2 text-[11px] leading-[18px] text-[#999999]">
                                Movies • Experiences • Memories
                            </Text>
                        </Section>

                        {/* ================= FOOTER ================= */}

                        <Section className="rounded-b-[12px] bg-[#f4f4f5] px-7 py-6 sm:px-9">
                            <Text className="m-0 text-[11px] leading-[18px] text-[#999999]">
                                This is an automated security email from Cineza.
                                Please do not reply to this message.
                            </Text>

                            <Text className="m-0 mt-2 text-[11px] leading-[18px] text-[#aaaaaa]">
                                © {new Date().getFullYear()} {COMPANY_NAME}. All
                                rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
