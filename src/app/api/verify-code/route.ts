import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const POST = async (req: Request) => {
    await dbConnect();
    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User doesn't exist!"
            }, {
                status: 400
            })
        }

        const isCodeValid = code === user.verifyCode;
        const isCodeNotExpired = new Date() < new Date(user.verifyCodeExpiry);

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
        }

        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'Verification code has expired. Please sign up again to get a new code.',
            }, {
                status: 400
            })
        }
        else {
            return Response.json({
                success: false,
                message: "Invalid Verification code!"
            }, {
                status: 400
            })

        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{
            status: 500
        })
    }
}