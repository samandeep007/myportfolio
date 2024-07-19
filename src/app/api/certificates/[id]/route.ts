import CertificateModel from "@/models/Certificate";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helpers/uploadImage";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const userId = session.user._id;
        const id = params.id;
        const certificate = await CertificateModel.findOne({userId: userId, _id: id});
        if(!certificate){
            return Response.json({success: false, message: "Certifcate not found"}, {status: 404});
        }
        return Response.json({success: true, message: "Certificate retrieved successfully!", data: certificate}, {status: 200});
        
    } catch (error) {
        console.error("Failed to retrieve certificate", error);
        return Response.json({success: false, message: "Failed to retrieve certificate"}, {status: 500});
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
        const formData = await request.formData();

        const certificate = await CertificateModel.findOne({userId: userId, _id: id});
        if(!certificate){
            return Response.json({success: false, message: "Certificate not found!"}, {status: 404});
        }
        const title = formData.get('title') as string || null;
        const company = formData.get('company') as string || null;
        const certificateNumber = formData.get('certificateNumber') as string || null;
        const completionDate = formData.get('completionDate') as string || null;
        const skills = formData.get('skills') as string || null;
        const link = formData.get('link') as string || null;
        const document = formData.get('document') as File || null;

        if(title) certificate.title = title;
        if(company) certificate.company = company;
        if(certificateNumber) certificate.certificateNumber = certificateNumber;
        if(completionDate) certificate.completionDate = new Date(completionDate);
        if(skills) certificate.skills = skills.split(", ");
        if(link) certificate.link = link;

        if(document){
            const documentBuffer = Buffer.from(await document.arrayBuffer());
            const documentLink = await uploadOnCloudinary(documentBuffer);
            if(!documentLink){
                return Response.json({success: false, message: "Document upload failed!"}, {status: 400});
            }
            certificate.document = documentLink;
        }

        await certificate.save({validateBeforeSave: false});

        return Response.json({success: true, message: "Certificate updated successfully"}, {status: 200});

        
    } catch (error) {
        console.error("Failed to update certificate", error);
        return Response.json({success: false, message: "Failed to update certificate"}, {status: 500});
    }
}


export const DELETE = async(request: Request, {params}: {params: {id: string}}) => {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return Response.json({success: false, message: "Unauthorized"}, {status: 401});
        }
        const userId = session.user._id;
        const id = params.id;
        const deletedCertificate = await CertificateModel.findOneAndDelete({userId: userId, _id: id});
        if(!deletedCertificate){
            return Response.json({success: false, message: "Certificate not found"}, {status: 400});
        }
        return Response.json({success: false, message: "Certificate deleted successfully"}, {status: 200});
        
    } catch (error) {
        console.error("Failed to delete certificate", error);
        return Response.json({success: false, message: "Failed to delete document"}, {status: 500});
    }
}