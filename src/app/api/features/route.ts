import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";
import FeatureModel from "@/models/Features";

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const formData = await request.formData();
        const projectId = formData.get('projectId') as string || null;
        if(!projectId){
            return Response.json({success: false, message: "Something went wrong"}, {status: 500})
        }
        const project = await ProjectModel.findOne({_id: projectId, userId: session.user._id});
        if(!project){
            return Response.json({success: false, message: "Project doesn't exist"}, {status: 400});
        }
        const title = formData.get('title') as string || null;
        const description = formData.get('description') as string || null;
        const media = formData.get('media') as File || null;

        if([title, description, media].some(field => field === null)){
            return Response.json({success: false, message: "All fields are required"}, {status: 400})
        }

        const mediaBuffer = Buffer.from(await media.arrayBuffer());
        const mediaUrl = await uploadOnCloudinary(mediaBuffer);
        if(!mediaUrl){
            return Response.json({success: false, message: "Media upload failed"}, {status: 400})
        }

        await FeatureModel.create({
            projectId: projectId,
            title: title,
            description: description,
            media: mediaUrl
        })

        return Response.json({success: true, message: "Feature added successfully"}, {status: 200})

    } catch (error) {
        console.error("Creating feature failed", error);
        return Response.json({success: false, message: "Creating feature failed"}, {status: 500});
    }
}