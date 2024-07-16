import BlogModel from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";

export const GET = async(req: Request) => {
    await dbConnect();
    try {
        const blogs = await BlogModel.find();

        if(!blogs.length){
            return Response.json({
                success: true,
                message: "No blogs found"
            },{
                status: 200
            })
        }

        return Response.json({
            success: true,
            message: "Blogs retrieved successfully!",
            data: blogs
        },{
            status: 200
        })

        
    } catch (error) {
        console.error("Something went wrong while fetching the blogs")
        return Response.json({
            success: false,
            message: "Something went wrong while creating the user"
        }, {
            status: 500
        })
    }
}