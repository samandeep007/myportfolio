import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt';


export const POST = async(request: Request) => {
    await dbConnect();
    try {
        const reqBody = await request.json();
        const {username, email, password, fullName} = reqBody;

        if([username, email, password, fullName].filter(field => field?.trim() === "" || field?.trim() === null)){
            throw new Error("All fields are required");
        }

        const existingUserByUsername = await UserModel.findOne({username, isVerified: true});
        if(existingUserByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken!"
            }, {
                status: 400
            })
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const verifyCode = String(Math.floor(100000 + Math.random() * 900000));
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

        const existingUserByEmail = await UserModel.findOne({email});
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                },{
                    status: 400
                })
            }

            else {
                existingUserByEmail.password = encryptedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
                existingUserByEmail.username = username;
                existingUserByEmail.fullName = fullName;

                await existingUserByEmail.save({validateBeforeSave: false});
            }
        }

        else {
            await UserModel.create({
                username: username,
                email: email,
                password: encryptedPassword,
                fullName: fullName,
                verifyCode: verifyCode,
                verifyCodeExpiry: verifyCodeExpiry
            })
        }

        //email logic

        return Response.json({
            success:true,
            message: "User registerated successfully!"
        },{
            status: 200
        })

    } catch (error: any) {
        return Response.json({
            success:false,
            message: "User registeration failed!"
        },{
            status: 400
        })
        
    }
}