import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const formData = await request.formData();
        const title
        
    } catch (error) {
        console.error("Creating feature failed", error);
        return Response.json({success: false, message: "Creating feature failed"}, {status: 500});
    }
}