import UserModel, { Reply } from "@/models/User";
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
        const reply = user.replies.filter(reply => reply.messageId === id);

        return Response.json({success: true, message: "Message retrieved successfully!", data: {...message, ...reply}}, {status: 200});
        
    } catch (error) {
        console.error("Message retrieval failed", error);
        return Response.json({success: false, message: "Message retrieval faied"},{status: 500});
    }
}

export const POST = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        // const session = await getServerSession(authOptions);
        // if(!session || !session.user){
        //     return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        // }
        const id = params.id;
        const {content, username} = await request.json();
      
        const user = await UserModel.findOne({username: username});
        if(!user){
            return Response.json({success: false, message: "User not found!"}, {status: 404});
        }

        const reply = {messageId: id, content: content};
      
        user.replies.push(reply as Reply);
      
        await user.save({validateBeforeSave: false});

        return Response.json({success: true, message: "Reply sent successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Error sending reply", error);
        return Response.json({success: false, message: "Error sending reply!"},{status: 500})
    }
}


export const DELETE = async (request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    const messageId = params.id;

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({success: false, message: "Unauthorized"},{status: 401})
    }
    const userId = session.user._id;
    try {
       const updateResult =  await UserModel.updateOne(
            {_id: userId},
            {
                $pull: {
                    messages: {_id: messageId}
                }
            }
        )

        if(updateResult.modifiedCount === 0){
            return Response.json({success: false, message: "Message not found or already deleted"}, { status: 404 })
        }

        return Response.json({ success: true, message: "Message deleted successfully!"}, {status: 200});
           

    } catch (error) {
        console.log("error in delete message route", error)
        return Response.json({success: false, message: "Error deleting message!"},{status: 500})
    }}
