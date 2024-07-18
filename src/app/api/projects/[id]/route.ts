import ProjectModel, { Project } from "@/models/Project";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        const projectId = params.id;

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return Response.json({ success: false, message: "Project not found!" }, { status: 404 })
        }
        return Response.json({ success: true, message: "Project retrieved successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Project retrieval failed", error);
        return Response.json({ success: false, message: "Project retrieval failed" }, { status: 500 });
    }
}


export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const id = params.id;

        const project = await ProjectModel.findOne({userId: session.user._id, _id: id});
        if(!project){
            return Response.json({success: false, message: "Project doesn't exist"}, {status: 404});
        }

        const formData = await request.formData();
        const title = formData.get('title') as string || null;
        const description = formData.get('description') as string || null;
        const technologies = formData.get('technologies') as string || null;
        const image = formData.get('image') as File || null;

        const updatedData: any = {};
        if (image) {
            const imageBuffer = Buffer.from(await image.arrayBuffer());
            const imageUrl = await uploadOnCloudinary(imageBuffer);
            if (imageUrl) {
                updatedData.image = imageUrl;
            }
        }

        if(title) updatedData.title = title;
        if(description) updatedData.description = description;
        if(technologies) updatedData.technologies = technologies.split(", ");
        
        Object.assign(project, updatedData as Project)
        await project.save({validateBeforeSave: false});
        
        return Response.json({success: true, message: "Project updated successfully"}, {status: 200});

    } catch (error) {
        console.error("Updating project failed");
        return Response.json({ success: false, message: "Updating project failed!" }, { status: 500 })
    }
}

export const DELETE = async(request: Request, {params}: {params: {id: string}}) =>{
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }

        const id = params.id;

        const deletedProject = await ProjectModel.findOneAndDelete({userId: session.user._id, _id: id});

        if(!deletedProject){
            return Response.json({success: false, message: "Project doesn't exist"}, {status: 400})
        }

        return Response.json({success: true, message: "Project deleted successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Deleting project failed!", error);
        return Response.json({success: false, message: "Deleting project failed"}, {status: 500});
    }
}