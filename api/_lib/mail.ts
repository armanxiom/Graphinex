import nodemailer from 'nodemailer';

export function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!hasSmtpConfig()) {
    throw new Error('SMTP is not configured.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Graphinex admin password reset',
    text: `Reset your Graphinex admin password here: ${resetUrl}`,
    html: `<p>Reset your Graphinex admin password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
}

