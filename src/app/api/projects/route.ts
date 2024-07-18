import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";


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

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const formData = await request.formData();
        const title = formData.get('title') as string || null;
        const description = formData.get('description') as string || null;
        const link = formData.get('link') as string || null;
        const technologies = formData.get('technologies') as string || null;
        const image = formData.get('image') as File || null;

        if([title, description, link, technologies, image].some(field => field === null)){
            return Response.json({success: false, message: "All fields are required!"}, {status: 400})
        }

        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const imageUrl = await uploadOnCloudinary(imageBuffer);
        if(!imageUrl){
            return Response.json({success: false, message: "Image upload failed"}, {status: 400});
        }

        await ProjectModel.create({
            title: title,
            description: description,
            link: link,
            technologies: technologies?.split(", "),
            image: imageUrl
        })

        return Response.json({success: true, message: "Project created successfully"}, {status: 200});       
        
    } catch (error) {
        console.error("Creating project failed", error);
        return Response.json({success: false, message: "Creating project failed"}, {status: 500});
    }
}