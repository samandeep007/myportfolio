import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const userId = session.user._id;
        const id = params.id;
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({success: false, message: "User not found!"},{status: 400})
        }
        const message = user.messages.filter(message => message._id === id);
        if(!message){
            return Response.json({success: false, message: "Message not found"}, {status: 404})
        }
        return Response.json({success: true, message: "Message retrieved successfully!", data: message}, {status: 200});
        
    } catch (error) {
        console.error("Message retrieval failed", error);
        return Response.json({success: false, message: "Message retrieval faied"},{status: 500});
    }
}

export const POST = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session){
            return Response.json({success: false, message: "Unauthorized"},{status: 401})
        }
        const userId = session.user._id;
        const id = params.id;
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({success: false, message: "User not found"}, {status: 404})
        }
        
        
    } catch (error) {
        console.error("Error replying to the message");
        return Response.json({success: false, message: "Error replying to the message"}, {status: 500})
    }
}