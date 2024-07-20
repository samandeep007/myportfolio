import EducationModel from "@/models/Education";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user._id;
        const id = params.id;
        const education = await EducationModel.findOne({ userId: userId, _id: id });
        if (!education) {
            return Response.json({ success: false, message: "Education details not found" }, { status: 404 });
        }
        return Response.json({ success: true, message: "Education details retrieved successfully", data: education }, { status: 200 });
    } catch (error) {
        console.error("Failed to retrieve education details", error);
        return Response.json({ success: false, message: "Failed to retrieve education details" }, { status: 500 });
    }
}

export const PUT = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const userId = session.user._id;
        const id = params.id;
        const education = await EducationModel.findOne({userId: userId, _id: id});
        if(!education){
            return Response.json({success: false, message: "Education details not found"}, {status: 400});
        }
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

        if(media){
            const mediaBuffer = Buffer.from(await media.arrayBuffer());
            const mediaUrl = await uploadOnCloudinary(mediaBuffer);
            if(!mediaUrl){
                return Response.json({success: false, message: "Media upload failed!"}, {status: 400});
            }
            education.media = mediaUrl;
        }

        if(school) education.school = school;
        if(degree) education.degree = degree;
        if(field) education.field = field;
        if(startDate) education.startDate = new Date(startDate);
        if(endDate) education.endDate = new Date(endDate);
        if(grade) education.grade = Number(grade);
        if(activities) education.activities = activities;
        if(description) education.description = description;
        if(skills) education.skills = skills.split(', ');

        await education.save({validateBeforeSave: false});
        return Response.json({success: true, message: "Education details updated successfully"}, {status: 200});
    } catch (error) {
        console.error("Failed to update education details", error);
        return Response.json({success: false, message: "Failed to delete education details"}, {status: 500});
    }
}


export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user._id;
        const id = params.id;
        const deletedEducation = await EducationModel.findOneAndDelete({ userId: userId, _id: id });
        if (!deletedEducation) {
            return Response.json({ success: false, message: "Education details not found" }, { status: 404 });
        }
        return Response.json({ success: true, message: "Education details deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Failed to delete education details", error);
        return Response.json({ success: false, message: "Failed to delete education details" }, { status: 500 });
    }
}