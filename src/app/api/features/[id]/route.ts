import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        
        
    } catch (error) {
        console.error("Error retrieving feature", error);
        return Response.json({success: false, message: "Error retrieving feature"}, {status: 500})
    }
}