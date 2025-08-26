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


// NEW FUNCTION: Send weather alert email
export const sendWeatherAlertEmail = async (userEmail, userName, alerts, location) => {
    try {
        const transporter = createTransporter();

        // Group alerts by severity for better presentation
        const alertsBySeverity = alerts.reduce((acc, alert) => {
            if (!acc[alert.severity]) acc[alert.severity] = [];
            acc[alert.severity].push(alert);
            return acc;
        }, {});

        const severityColors = {
            extreme: '#dc3545',
            high: '#fd7e14',
            moderate: '#ffc107',
            low: '#28a745'
        };

        const severityIcons = {
            extreme: '🚨',
            high: '⚠️',
            moderate: '⚡',
            low: 'ℹ️'
        };

        // Generate alert HTML
        let alertsHtml = '';
        Object.keys(alertsBySeverity).forEach(severity => {
            const color = severityColors[severity];
            const icon = severityIcons[severity];

            alertsHtml += `
                <div style="border-left: 4px solid ${color}; padding: 15px; margin: 15px 0; background-color: #f8f9fa;">
                    <h4 style="color: ${color}; margin: 0 0 10px 0;">
                        ${icon} ${severity.charAt(0).toUpperCase() + severity.slice(1)} Alert${alertsBySeverity[severity].length > 1 ? 's' : ''}
                    </h4>
            `;

            alertsBySeverity[severity].forEach(alert => {
                alertsHtml += `
                    <p style="margin: 5px 0; color: #333;">
                        <strong>${alert.alertCondition.replace('_', ' ').toUpperCase()}:</strong> ${alert.message}
                    </p>
                `;
            });

            alertsHtml += '</div>';
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `🌤️ Weather Alert for ${location.city}, ${location.country}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🌤️ Weather Alert</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                            Important weather update for your default location
                        </p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                            Hello ${userName},
                        </p>
                        
                        <p style="color: #666; margin-bottom: 25px;">
                            We have detected weather conditions that may affect you at your default location:
                        </p>
                        
                        <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                            <h3 style="margin: 0; color: #495057;">📍 ${location.city}, ${location.country}</h3>
                        </div>
                        
                        ${alertsHtml}
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 25px;">
                            <h4 style="color: #495057; margin-top: 0;">🔔 Stay Safe</h4>
                            <p style="color: #666; margin-bottom: 0;">
                                Please take appropriate precautions based on the weather conditions. 
                                Check our app for real-time updates and detailed forecasts.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="http://localhost:5173/weather" 
                               style="background-color: #007bff; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                                View Full Weather Report
                            </a>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                        <p style="color: #666; font-size: 14px; margin: 0;">
                            You received this alert because ${location.city}, ${location.country} is set as your default location.
                        </p>
                        <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
                            Weather Alert System | ${new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Weather alert email sent:', result.messageId);
        return result;

    } catch (error) {
        console.error('Error sending weather alert email:', error);
        throw new Error('Failed to send weather alert email');
    }
};

// NEW FUNCTION: Process and send pending weather alert emails
export const processPendingWeatherAlerts = async () => {
    try {
        const WeatherAlert = (await import('../models/WeatherAlert.js')).default;

        console.log('🔄 Checking for pending weather alert emails...');

        const pendingAlerts = await WeatherAlert.getUnsentEmailAlertsForDefaultLocations();

        if (pendingAlerts.length === 0) {
            console.log('✅ No pending weather alert emails found');
            return;
        }

        console.log(`📧 Found ${pendingAlerts.length} pending weather alert emails`);

        // Group alerts by user and location
        const alertsByUser = pendingAlerts.reduce((acc, alert) => {
            const key = `${alert.userId._id}_${alert.locationId._id}`;
            if (!acc[key]) {
                acc[key] = {
                    user: alert.userId,
                    location: alert.locationId,
                    alerts: []
                };
            }
            acc[key].alerts.push(alert);
            return acc;
        }, {});

        let emailsSent = 0;
        let emailsFailed = 0;

        // Send emails for each user-location combination
        for (const key in alertsByUser) {
            const { user, location, alerts } = alertsByUser[key];

            try {
                await sendWeatherAlertEmail(user.email, user.fullName, alerts, location);

                // Mark all alerts as email sent
                for (const alert of alerts) {
                    await alert.markEmailAsSent();
                }

                emailsSent++;
                console.log(`✅ Email sent to ${user.email} for ${location.city}, ${location.country}`);

            } catch (error) {
                console.error(`❌ Failed to send email to ${user.email}:`, error.message);
                emailsFailed++;
            }
        }

        console.log(`📊 Email processing complete: ${emailsSent} sent, ${emailsFailed} failed`);

        return {
            sent: emailsSent,
            failed: emailsFailed,
            total: Object.keys(alertsByUser).length
        };

    } catch (error) {
        console.error('Error processing pending weather alerts:', error);
        throw error;
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