import cron from 'node-cron';
import { processPendingWeatherAlerts } from './emailService.js';

// Schedule email processing every 30 minutes
export const startEmailScheduler = () => {
    console.log('📅 Starting weather alert email scheduler...');

    // Run every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('⏰ Running scheduled email processing...');
        try {
            const result = await processPendingWeatherAlerts();
            console.log(`✅ Scheduled email processing complete: ${result.sent} sent, ${result.failed} failed`);
        } catch (error) {
            console.error('❌ Scheduled email processing failed:', error);
        }
    });

    // Also run at 6 AM daily for morning alerts
    cron.schedule('0 6 * * *', async () => {
        console.log('🌅 Running morning weather alert check...');
        try {
            const result = await processPendingWeatherAlerts();
            console.log(`✅ Morning email processing complete: ${result.sent} sent, ${result.failed} failed`);
        } catch (error) {
            console.error('❌ Morning email processing failed:', error);
        }
    });

    console.log('✅ Email scheduler started successfully');
};