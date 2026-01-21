import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  body: string
) {
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: body,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}
