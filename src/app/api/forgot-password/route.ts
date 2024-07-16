import { sendEmail } from "@/helpers/sendEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const POST = async (request: Request) => {
    await dbConnect();
    try {
        const { identifier } = await request.json();
        if (!identifier) {
            return Response.json({success: false, message: "Email/Username is missing!"}, {status: 400});
        }
        const user = await UserModel.findOne({$or: [{email: identifier}, {username: identifier}]});
        if(!user){
            return Response.json({success: false, message: "User with this email/username doesn't exist"},{status: 400});
        }
        if(!user.isVerified){
            return Response.json({success: false, message: "User is not verified. Verify or signUp again"}, {status: 400})
        }
        const verifyCode = String(Math.floor(100000 + Math.random() * 999999));
        const expiryDate = new Date();
        
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(expiryDate.getHours() + 1);
        
        await user.save({validateBeforeSave: false});
        const emailResponse = await sendEmail({email: user.email, username: user.username, verifyCode: verifyCode, type: "PasswordReset", message:"", name:user.fullName});
        if(!emailResponse.success){
            return Response.json({success: false, message: "Sending verification email failed"}, {status: 400})
        }
        return Response.json({success: true, message: "Password reset email sent"}, {status: 200})

    } catch (error) {
        console.error("Something went wrong!", error);
        return Response.json({ success: false, message: "Something went wrong" }, { status: 500 });

    }
}