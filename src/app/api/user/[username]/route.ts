import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const GET = async(request: Request, {params}: {params: {username: string}}) => {
    await dbConnect();
    try {
        const username = params.username;
        const user = await UserModel.findOne({username: username});
        if(!user){
            return Response.json({success: false, message: "User not found!"}, {status: 404});
        }
        
        return Response.json({success: false, message: "User found!"}, {status: 200})
        
    } catch (error) {
        console.error("Something went wrong while fetching the user", error);
        return Response.json({success: false, message: "Something went wrong while fetching the user"}, {status: 500})
    }
}