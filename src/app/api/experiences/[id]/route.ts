import ExperienceModel from "@/models/Experience";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions} from "../../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401})
        }
        const id = params.id;
        const experience = await ExperienceModel.findOne({userId: session.user._id, _id: id});
        if(!experience){
            return Response.json({success: false, message: "Experience not found"}, {status: 404})
        }
        return Response.json({success: true, message: "Experience retrieved successfully", data: experience}, {status: 200})
        
    } catch (error) {
        console.error("Retrieving experience failed", error);
        return Response.json({success: false, message: "Retrieving experience failed"})
    }
}

export const PUT = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const userId = session.user._id
        const id = params.id;
        const experience = await ExperienceModel.findOne({userId: userId, _id: id });
        if(!experience){
            return Response.json({success: false, message: "Experience not found"}, {status: 400});
        }

        const formData = await request.formData();
        const companyName = formData.get('companyName') as string || null;
        const companyLocation = formData.get('companyLocation') as string || null;
        const companyLogo = formData.get('companyLogo') as File || null;
        const jobType = formData.get('jobData') as string || null;
        const roleDescription = formData.get('roleDescription') as string || null;
        const startDate = formData.get('startDate') as string || null;
        const endDate = formData.get('endDate') as string || null;

        if(companyName) experience.companyName = companyName;
        if(companyLocation) experience.companyLocation = companyLocation;
        if(jobType) experience.jobType = jobType;
        if(roleDescription) experience.roleDescription = roleDescription;
        if(startDate) experience.startDate = new Date(startDate);
        if(endDate) experience.endDate = new Date(endDate);

        if(companyLogo){
            const companyLogoBuffer = Buffer.from(await companyLogo.arrayBuffer());
            const companyLogoUrl = await uploadOnCloudinary(companyLogoBuffer);
            if(!companyLogoUrl){
                return Response.json({success: false, message: "Company logo upload failed"}, {status: 400});
            }
            experience.companyLogo = companyLogoUrl;
        }

        await experience.save({validateBeforeSave: false});

        return Response.json({success: true, message: "Experience updated successfully"}, {status: 200});

        
    } catch (error) {
        console.error("Updating experience failed", error);
        return Response.json({success: false, message: "Updating experience failed"}, {status: 500});
    }
}

export const DELETE = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "unauthorized"}, {status: 401});
        }
        const id = params.id;
        const userId = session.user._id;
        const deletedExperience = await ExperienceModel.findOneAndDelete({userId: userId, _id: id});
        if(!deletedExperience){
            return Response.json({success: false, message: "Experience not found!"}, {status: 400});
        }
        return Response.json({success: true, message: "Experience deleted successfully"}, {status: 200})
    } catch (error) {
        console.error("Deleting experience failed", error);
        return Response.json({success: false, message: "Deleting experience failed"}, {status: 500})
    }
}