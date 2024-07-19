import EducationModel from "@/models/Education";
import dbConnect from "@/lib/dbConnect";
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
        const education = await EducationModel.find({userId: userId});
        if(!education.length){
            return Response.json({success: false, message: "No education details found"}, {status: 404});
        }
        return Response.json({success: true, message: "Education details retrieved successfully", data: education}, {status: 200})
        
    } catch (error) {
        console.error("Failed to retrieve education details", error);
        return Response.json({success: false, message: "Failed to retrieve education details"}, {status: 500});
    }
}


export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "unauthorized"}, {status: 401});
        }
        const userId = session.user._id;
        const formData = await request.formData();
        
        const school = formData.get('school') as string || null;
        const degree = formData.get('degree') as string || null;
        const field = formData.get('field') as string || null;
        const startDate = formData.get('startDate') as string || null;
        const endDate = formData.get('endDate') as string || null;
        const grade = formData.get('grade') as string || null;
        const activities = formData.get('activities') as string || null;
        const description = formData.get('description') as string || null;
        const skills = formData.get('skills') as string || null;
        const media = formData.get('media') as File || null;

        if([school, degree, field, startDate, endDate, grade, description, skills].some(field => field === null || field === "")){
            return Response.json({success: false, message: "All fields are required"}, {status: 400});
        }

        let mediaUrl;
        if(media){
            const mediaBuffer = Buffer.from(await media.arrayBuffer());
            mediaUrl = await uploadOnCloudinary(mediaBuffer);
            if(!mediaUrl){
                return Response.json({success: false, message: "Media upload failed"}, {status: 400});
            }
        }

        await EducationModel.create({
            userId: userId,
            school: school,
            degree: degree,
            field: field,
            startDate: new Date(startDate!),
            endDate: new Date(endDate!),
            grade: Number(grade),
            activities: activities,
            skills: skills?.split(', '),
            media: mediaUrl,
            description: description
        })

        return Response.json({success: false, message: "Education details added successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Failed to add education details", error);
        return Response.json({success: false, message: "Failed to retrieve education details"}, {status: 500});
    }
}