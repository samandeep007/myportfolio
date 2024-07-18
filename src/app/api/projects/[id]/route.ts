import ProjectModel from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"},{status:401})
        }
        const projectId = params.id;

        const project = await ProjectModel.findById(projectId);
        if(!project){
            return Response.json({success: false, message: "Project not found!"},{status: 404})
        }
        return Response.json({success: true, message: "Project retrieved successfully!"}, {status: 200});
        
    } catch (error) {
        console.error("Project retrieval failed", error);
        return Response.json({success: false, message: "Project retrieval failed"}, {status: 500});
    }
}

export const POST = async