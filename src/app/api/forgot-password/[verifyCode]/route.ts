import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt';

export const POST = async(request: Request, {params}: {params: {verifyCode: string}}) => {
    await dbConnect();
    try {
        const verifyCode = params.verifyCode;
        const {password} = await request.json();

        if(!password){
            return Response.json({success: false, message: "New password is missing!"}, {status: 400});
        }

        const user = await UserModel.findOne({verifyCode: verifyCode});
        if(!user){
            return Response.json({success: false, message: "Verification link is invalid"})
        }

        const isPasswordExpired = new Date() > user.verifyCodeExpiry
        
        if(isPasswordExpired){
            return Response.json({success: false, message: "Verification code is expired"})
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
        user.verifyCode = "";
        await user.save({validateBeforeSave: false});
        
        return Response.json({success: true, message: "Password reset successful!"}, {status: 200});

    } catch (error) {
        console.error("Password reset failed!", error);
        return Response.json({success: false, message: "Password reset failed!"}, {status: 500})
    }
}