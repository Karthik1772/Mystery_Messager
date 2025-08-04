import { transporter } from '@/lib/nodemailer';
import { ApiResponse } from '@/types/ApiResponse';
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const res = await transporter.sendMail({
      from: `"Mystery Message" ${process.env.NODEMAILER_USER_EMAIL}`,
      to: email,
      subject: "Mystery Message Verification Code ",
      html: generateVerificationEmailHTML(username, verifyCode)
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}