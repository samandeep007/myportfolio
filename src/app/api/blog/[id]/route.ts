import BlogModel from "@/models/Blog";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

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

export const PUT = async(request: Request, {params}:{params: {id: string}}) => {
    await dbConnect();
    try {
        
    } catch (error) {
        
    }
}