import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User";
import { sendEmail } from "@/helpers/sendEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const{username, senderEmail, senderName, subject, content} = await request.json();
        if([username, senderEmail, senderName, subject, content].some(field => field === undefined || field === "")){
            return Response.json({success: false, message: "All fields are required!"}, {status: 400});
        }
        const user = await UserModel.findOne({username: username});
        if(!user){
            return Response.json({success: false, message: "User doesn't exist"}, {status: 400});
        }

        const message = {senderEmail: senderEmail, senderName: senderName, subject: subject, content: content, createdAt: new Date()};

        user.messages.push(message as Message);
        await user.save({validateBeforeSave: false});

        const emailResponse = await sendEmail({username: username, email: senderEmail, verifyCode: "", type: "contact", message: content, name: senderName});
        if(!emailResponse.success){
            return Response.json({success: false, message: "Unable to send message"},{status: 400})
        }

        return Response.json({success: true, message: "Message sent successfully"}, {status: 200});

    } catch (error) {
        console.error("Something went wrong while sending the message");
    }
}


export const GET = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 400})
        }
        const userId = session.user._id;
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({success: false, message: "Error 404: User not found"},{status: 404});
        }
        if(!user.messages.length){
            return Response.json({success: true, message: "User inbox is empty", data: []}, {status: 200});
        }
        return Response.json({success: true, message: "User messages retrieved successfully", data: user.messages}, {status: 200});
        
    } catch (error) {
        console.error("Error fetching messages", error);
        return Response.json({success: false, message: "Error fetching messages"}, {status: 500});
    }
}