import dbConnect from "@/lib/dbConnect";
import { sendEmail } from "@/helpers/sendEmail";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt';

export const POST = async (request: Request) => {
  await dbConnect();

  try {
    const reqBody = await request.json();
    const { username, email, password, fullName } = reqBody;

    // Validate input fields
    if ([username, email, password, fullName].some(field => !field?.trim())) {
      throw new Error("All fields are required");
    }

    // Check if the username is already taken
    const existingUserByUsername = await UserModel.findOne({ username, isVerified: true });
    if (existingUserByUsername) {
      return new Response(JSON.stringify({
        success: false,
        message: "Username is already taken!"
      }), {
        status: 400
      });
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Generate verification code and expiry time
    const verifyCode = String(Math.floor(100000 + Math.random() * 900000));
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    // Check if the email is already registered
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(JSON.stringify({
          success: false,
          message: "User already exists with this email"
        }), {
          status: 400
        });
      } else {
        // Update existing user with new details
        existingUserByEmail.password = encryptedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
        existingUserByEmail.username = username;
        existingUserByEmail.fullName = fullName;

        await existingUserByEmail.save({ validateBeforeSave: false });
      }
    } else {
      // Create new user
      await UserModel.create({
        username,
        email,
        password: encryptedPassword,
        fullName,
        verifyCode,
        verifyCodeExpiry
      });
    }

    // Send verification email
    const emailResponse = await sendEmail({
      email,
      username,
      verifyCode,
      type: "verify",
      message: "",
      name: fullName
    });

    if (!emailResponse.success) {
      return new Response(JSON.stringify({
        success: false,
        message: emailResponse.message
      }), {
        status: 500
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "User registered successfully!"
    }), {
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "User registration failed!"
    }), {
      status: 400
    });
  }
};
