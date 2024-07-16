import BlogModel from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { uploadOnCloudinary } from "@/helpers/uploadImage";
import mongoose from "mongoose";

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
            }, {
                status: 403
            })
        }
        const userId = session.user._id
        const formData = await request.formData();


        const title = formData.get("title") as string || null;
        const content = formData.get("content") as string || null;
        const isArchived = formData.get("content") as string || null;
        const tags = formData.get("content") as string || null;
        const image = formData.get("image") as File || null;

        if ([title, content, isArchived, image, tags].some(field => !field)) {
            return Response.json({
                success: false,
                message: "Fields are missing"
            }, { status: 400 })

        }

              // Convert the image file to a buffer for Cloudinary
              const imageBuffer = Buffer.from(await image.arrayBuffer());
              const imageUrl = await uploadOnCloudinary(imageBuffer);

              console.log(imageUrl)
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
            tags: tags?.split(", "),
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