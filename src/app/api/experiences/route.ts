import ExperienceModel from "@/models/Experience";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorize"}, {status: 401});
        }
        const experiences = await ExperienceModel.find({userId: session.user._id});
        if(!experiences.length){
            return Response.json({success: false, message: "No experiences found"}, {status: 404});
        }
        return Response.json({success: true, message: "Experiences retrieved successfully", data: experiences}, {status: 200});
        
    } catch (error) {
        console.error("Retrieving experience failed", error);
        return Response.json({success: false, message: "Retrieving experience failed"}, {status: 500});
    }
}

export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const userId = session.user._id;
        const formData = await request.formData();

        const companyName = formData.get('companyName') as string || null;
        const companyLocation = formData.get('companyLocation') as string || null;
        const companyLogo = formData.get('companyLogo') as File || null;
        const jobType = formData.get('jobType') as string || null;
        const jobRole = formData.get('jobRole') as string || null;
        const roleDescription = formData.get('roleDescription') as string || null;
        const startDate = formData.get('startDate') as string || null;
        const endDate = formData.get('endDate') as string || null

        if([companyName, companyLocation, companyLogo, jobType, jobRole, roleDescription, startDate].some(field => field===null)){
            return Response.json({success: false, message: "All fields are required"}, {status: 400})
        }

        const companyLogoBuffer = Buffer.from(await companyLogo.arrayBuffer());
        const companyLogoUrl = await uploadOnCloudinary(companyLogoBuffer);
        if(!companyLogoUrl){
            return Response.json({success: false, message: "Logo upload failed"}, {status: 400});
        }

        await ExperienceModel.create({
            userId: userId,
            companyName: companyName,
            companyLocation: companyLocation,
            companyLogo: companyLogoUrl,
            jobType: jobType,
            jobRole: jobRole,
            roleDescription: roleDescription,
            startDate: new Date(startDate!),
            endDate: new Date(endDate!) || null
        })

        return Response.json({success: true, message: "Experience added successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Failed to add experience", error);
        return Response.json({success: false, message: "Failed to add experience"}, {status: 500});
    }
}