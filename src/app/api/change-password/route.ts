import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from 'bcrypt';

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"},{status: 401})
        }
        const userId = session.user._id;
        const {currentPassword, newPassword} = await request.json();
        if(!currentPassword || !newPassword){
            return Response.json({success: false, message: "Fields are missing"},{status:400})
        }
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({success: false, message: "User doesn't exist"}, {status: 400})
        }
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if(!isValidPassword){
            return Response.json({success: false, message: "Wrong password!"},{status: 400})
        }
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;
        await user.save({validateBeforeSave: false});

        return Response.json({success: false, message: "Password changed successfully"},{status: 200})
        
    } catch (error) {
        console.error("Password change failed!", error);
        return Response.json({success: false, message: "Password change failed!"},{status: 500})
    }
}