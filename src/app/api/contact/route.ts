import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User";
import { sendEmail } from "@/helpers/sendEmail";

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

        return Response.json({success: false, message: "Message sent successfully"}, {status: 200});

    } catch (error) {
        console.error("Something went wrong while sending the message");
    }
}