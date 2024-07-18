import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import FeatureModel from "@/models/Features";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const id = params.id;
        const feature = await FeatureModel.findById(id);
        if(!feature){
            return Response.json({success: false, message: "Feature doesn't exist"}, {status: 400});
        }
        return Response.json({success: false, message: "Feature retrieved successfully!", data: feature}, {status: 200})
        
    } catch (error) {
        console.error("Error retrieving feature", error);
        return Response.json({success: false, message: "Error retrieving feature"}, {status: 500})
    }
}


export const PUT = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const id = params.id;
        const feature = await FeatureModel.findById(id);
        if(!feature){
            return Response.json({success: false, message: "Feature doesn't exist"}, {status: 400})
        }
        const formData = await request.formData();
        const title = formData.get('title') as string || null;
        const description = formData.get('description') as string || null;
        const media = formData.get('media') as File || null;

        if(media){
            const mediaBuffer = Buffer.from(await media.arrayBuffer());
            const mediaUrl = await uploadOnCloudinary(mediaBuffer);
            if(!mediaUrl){
                return Response.json({success: false, message: "Media upload failed"}, {status: 400});
            }
            feature.media = mediaUrl;
        }

        if(title) feature.title = title;
        if(description) feature.description = description;

        await feature.save({validateBeforeSave: false})
        return Response.json({success: true, message: "Feature updated successfully"}, {status: 200});
         
    } catch (error) {
        console.error("Updating feature failed", error);
        return Response.json({success: false, message: "Updating feature failed"}, {status: 500});
    }
}


export const DELETE = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "unauthorized"}, {status: 401});
        }
        const id = params.id;
        const deletedFeature = await FeatureModel.findByIdAndDelete(id);
        if(!deletedFeature){
            return Response.json({success: false, message: "Feature doesn't exist"}, {status: 400});
        }

        return Response.json({success: true, message: "Feature deleted successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Deleting feature failed", error);
        return Response.json({success: false, message: "Deleting feature failed"}, {status: 500});
    }
}