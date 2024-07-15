import BlogModel from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async (request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not authorized"
            }, {
                status: 403
            })
        }
        const user = session.user;

        const blogs = await BlogModel.find({ userId: user._id });
        if (blogs.length === 0) {
            return Response.json({
                success: false,
                message: "No blogs found"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Blogs retrieved successfully",
            data: blogs
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Something went wrong while fetching the notes", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}

export const POST = async (request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not authorized"
            }, {status: 401})
        }

        const userId = session.user._id;
        const { title, content, isArchived, featuredImage, tags } = await request.json();

        if ([title, content, isArchived, featuredImage, tags].some(field => !field?.trim())) {
            return Response.json({
                success: false,
                message: "Fields are missing"
            }, { status: 400 })
        }

        const imageUrl = await uploadOnCloudinary(featuredImage);
        if (!imageUrl) {
            return Response.json({
                success: false,
                message: "Image failed to upload"
            }, { status: 400})
        }

        await BlogModel.create({
            userId: userId,
            title: title,
            content: content,
            tags: tags,
            isArchived: isArchived,
            featuredImage: imageUrl
        })

        return Response.json({
            success: true,
            message: "Blog created successfully"
        },{status: 200})

    } catch (error) {
        console.error("Something went wrong while creating the blog", error)
        return Response.json({
            success: false,
            message: "Something went wrong while creating the blog"
        }, {
            status: 500
        })

    }
}