import EducationModel from "@/models/Education";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async(request: Request, {params}: {params: {id: string}}) => {
    
}