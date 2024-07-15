import { transporter } from "@/lib/nodemailer";
import verficationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';
import {render} from '@react-email/components'

export async function sendVerificationEmail(email: string, username: string, verifyCode: string):Promise<ApiResponse> {
    try {

        const email = render(verficationEmail({username, otp: verifyCode}));

        await transporter.sendMail({
            from: '3S Universe" <noreply@web-trade.biz>',
            to: email,
            subject: 'Verify your email | 3S Universe',
            html: email
        })
      
        return {success: false, message:"Failed to send the verification email"}
    } catch (emailError) {
        console.error("Error sending the verification email", emailError);
        return {success: false, message:"Failed to send the verification email"}
    }
}