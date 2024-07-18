import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export const GET = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const userId = session.user._id;
        const projects = await ProjectModel.find({userId: userId});
        if(!projects.length){
            return Response.json({success: true, message: "User has no projects"}, {status: 200})
        }
        return Response.json({success: true, message: "Projects retrieved successfully", data: projects}, {status: 200});
        
    } catch (error) {
        console.error("Retrieving projects failed", error);
        return Response.json({success: false, message: "Retrieving projects failed"},{status:500});
    }
}

export const POST = async