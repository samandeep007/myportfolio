import { transporter } from "@/lib/nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import ContactEmail from '../../emails/ContactEmail';
import { ApiResponse } from '@/types/ApiResponse';
import {render} from '@react-email/components'

interface sendEmailInterface {
    email: string,
    username: string,
    verifyCode: string,
    type: string,
    message: string,
    name: string
}
export async function sendEmail({email, username, verifyCode, type, message, name}: sendEmailInterface):Promise<ApiResponse> {
    try {
        let options = {};

        if(type==="verify"){
            options = {
                from: '3S Universe" <noreply@web-trade.biz>',
                to: email,
                subject: 'Verify your email | 3S Universe',
                html: render(VerificationEmail({username, otp: verifyCode}))
            }
        }

        if(type==="contact"){
            options = {
                from: '3S Universe" <noreply@web-trade.biz>',
                to: email,
                subject: 'Verify your email | 3S Universe',
                html: render(ContactEmail({name, message}))
            }
        }

        await transporter.sendMail(options);
        return {success: true, message:"Email sent successfully"}
    } catch (emailError) {
        console.error("Error sending the verification email", emailError);
        return {success: false, message:"Failed to send the verification email"}
    }
}