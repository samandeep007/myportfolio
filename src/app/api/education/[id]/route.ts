import EducationModel from "@/models/Education";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

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