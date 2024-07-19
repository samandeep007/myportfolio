import CertificateModel from "@/models/Certificate";
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
        const certificates = await CertificateModel.find({userId: userId});
        if(!certificates.length){
            return Response.json({success: false, message: "No certificates found"}, {status: 404})
        }
        return Response.json({success: true, message: "Certificates retrieved successfully", data: certificates}, {status: 200});
    } catch (error) {
        console.error("Retrieving certificates failed", error);
        return Response.json({success: false, message: "Retrieving certificates failed"}, {status: 500});
    }
}


export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const userId = session.user._id;
        const formData = await request.formData();
        const title = formData.get('title') as string || null;
        const company = formData.get('company') as string || null;
        const certificateNumber = formData.get('certificateNumber') as string || null;
        const completionDate = formData.get('completionDate') as string || null;
        const skills = formData.get('skills') as string || null;
        const link = formData.get('link') as string || null;
        const document = formData.get('document') as File || null;

        if([formData, title, company, certificateNumber, completionDate, skills, link, document].some(field => field === null || field === "")){
            return Response.json({success: false, message: "All fields are required"}, {status: 400});
        }

        const documentBuffer = Buffer.from(await document.arrayBuffer());
        const documentLink = await uploadOnCloudinary(documentBuffer);
        if(!documentLink){
            return Response.json({success: false, message: "Failed to upload document"}, {status: 400});
        }

        await CertificateModel.create({
            userId: userId,
            title: title,
            company: company,
            certificateNumber: certificateNumber,
            completionDate: new Date(completionDate!),
            skills: skills?.split(", "),
            link: link,
            document: documentLink
        })

        return Response.json({success: true, message: "Certificate added successfully"}, {status: 200});

        
    } catch (error) {
        console.error("Failed to add certificate", error);
        return Response.json({success: false, message: "Failed to add certificate"}, {status: 500});
    }
}