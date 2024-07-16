import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const{username, senderEmail, subject, content} = await request.json();
        if([username, senderEmail, subject, content].some(field => field === undefined || field === "")){
            return Response.json({success: false, message: "All fields are required!"}, {status: 400});
        }
        const user = await UserModel.findOne({username: username});
        
        
    } catch (error) {
        console.error("Something went wrong while sending the message");
    }
}