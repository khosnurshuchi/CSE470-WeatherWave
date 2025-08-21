import nodemailer from "nodemailer";

// Create transporter - Fixed function name
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const transporter = createTransporter();
        
        const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification - Your App Name',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Thank you for registering with our application!</p>
                    <p>Please click the button below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
                    <p style="color: #666; font-size: 14px;">
                        This verification link will expire in 24 hours.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't create an account with us, please ignore this email.
                    </p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', result.messageId);
        return result;

    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

// const sendResetPasswordEmail = async (email, resetToken, fullName) => {
//     try {
//         const transporter = createTransporter();
        
//         const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        
//         const mailOptions = {
//             from: process.env.EMAIL_USER, // Changed from EMAIL_FROM to EMAIL_USER to match your config
//             to: email,
//             subject: 'Reset Your Password',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2 style="color: #333;">Password Reset Request</h2>
//                     <p>Hello ${fullName},</p>
//                     <p>You requested a password reset. Click the button below to reset your password:</p>
//                     <div style="text-align: center; margin: 30px 0;">
//                         <a href="${resetUrl}" 
//                            style="background-color: #dc3545; color: white; padding: 12px 30px; 
//                                   text-decoration: none; border-radius: 5px; display: inline-block;">
//                             Reset Password
//                         </a>
//                     </div>
//                     <p>Or copy and paste this link in your browser:</p>
//                     <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
//                     <p style="color: #666; font-size: 14px;">
//                         This reset link will expire in 1 hour.
//                     </p>
//                     <p style="color: #666; font-size: 14px;">
//                         If you didn't request this password reset, please ignore this email.
//                     </p>
//                 </div>
//             `
//         };
        
//         const result = await transporter.sendMail(mailOptions);
//         console.log('Reset password email sent:', result.messageId);
//         return result;

//     } catch (error) {
//         console.error('Error sending reset password email:', error);
//         throw new Error('Failed to send reset password email');
//     }
// };


// Alternative: Test email configuration
export const testEmailConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('Email configuration is valid');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
};