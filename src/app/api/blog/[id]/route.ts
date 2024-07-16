import BlogModel from "@/models/Blog";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
        const blogId = params.id;
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return Response.json({ success: false, message: "Blog not found!" }, { status: 404 })
        }
        return Response.json({ success: true, message: "blog fetched successfully", data: blog }, { status: 200 })

    } catch (error) {
        console.error("Something went wrong while fetching the blog", error);
        return Response.json({ success: false, message: "Something went wrong while fetching the blog" }, { status: 500 })
    }
}

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"},{status: 400})
        }
        const user = session.user;

        const id = params.id;

        const blog = await BlogModel.findOne({id: id, userId: user._id})

        if(!blog){
            return Response.json({success: false, message: "Blog not found!"}, {status: 404})
        }

        const formData = await request.formData();

        const title = formData.get('title') as string || null;
        const content = formData.get('content') as string || null;
        const isArchived = formData.get('isArchived') as string || null;
        const tags = formData.get('tags') as string || null;
        const image = formData.get('title') as File || null;

      
        const updatedData: any = {};

        if (title) updatedData.title = title;
        if (content) updatedData.content = content;
        if (isArchived !== null) updatedData.isArchived = isArchived;
        if (tags) updatedData.tags = tags?.split(", ");

      
       if(image){
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const imageUrl = await uploadOnCloudinary(imageBuffer);
        if (imageUrl) {
            updatedData.featuredImage = imageUrl;
        }
       }

       Object.assign(blog, updatedData);
       await blog.save({validateBeforeSave: false});

       return Response.json({success: true, message: "Blog updated successfully!"}, {status: 200});     


    } catch (error) {
        console.error("Blog update failed!", error)
        return Response.json({ success: false, message: "Blog update failed!" }, { status: 500 })
    }
}

export const DELETE = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Not Authorized"}, {status: 401})
        }
        const userId = session.user._id;
        const id = params.id;
        const blog = await BlogModel.findOneAndDelete({_id: id, userId: userId});
        if(!blog){
            return Response.json({success: false, message: "Blog not found!"}, {status: 404})
        }
        return Response.json({success: true, message: "Blog deleted successfully"}, {status: 200})
        
    } catch (error) {
        console.error("Deletion failed", error);
        return Response.json({success: false, message: "Deletion failed!"},{status: 500});
    }
}