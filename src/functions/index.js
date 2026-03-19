// functions/index.js
const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
const postmark = require('postmark');


admin.initializeApp();
const postmarkClient = new postmark.ServerClient(functions.config().postmark.server_token);

// 1. GUEST CHECK-IN CONFIRMATION (to guest after check-in)
exports.sendGuestCheckInConfirmation = functions.firestore
  .document('Checkins/{checkinId}')
  .onCreate(async (snapshot, context) => {
    const checkinData = snapshot.data();
    
    try {
      await postmarkClient.sendEmail({
        "From": "checkin@bookello.com",
        "To": checkinData.email,
        "Subject": `✓ Check-in Confirmed - ${checkinData.hotel}`,
        "HtmlBody": `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Check-in Confirmed! ✓</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for choosing ${checkinData.hotel}</p>
            </div>
            
            <div style="padding: 30px;">
              <p>Dear <strong>${checkinData.guestName}</strong>,</p>
              <p>Your check-in at <strong>${checkinData.hotel}</strong> has been successfully processed.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #2d3748;">Booking Details</h3>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Property:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.hotel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Check-in:</strong></td>
                    <td style="padding: 8px 0;">${new Date(checkinData.checkInDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Check-out:</strong></td>
                    <td style="padding: 8px 0;">${new Date(checkinData.checkOutDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Amount:</strong></td>
                    <td style="padding: 8px 0;">$${checkinData.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Payment Method:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.paymentMethod === 'card' ? '💳 Credit Card' : '💵 Cash'}</td>
                  </tr>
                </table>
              </div>
              
              <p>We hope you have a wonderful stay! If you need anything during your visit, please don't hesitate to contact the front desk.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #718096; font-size: 14px;">Safe travels and enjoy your stay!</p>
              </div>
            </div>
            
            <div style="background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">© 2024 Bookello. All rights reserved.</p>
            </div>
          </div>
        `,
        "MessageStream": "transactional"
      });

      await snapshot.ref.update({ confirmationEmailSent: true });
      console.log('Guest check-in confirmation sent to:', checkinData.email);
    } catch (error) {
      console.error('Error sending guest confirmation:', error);
    }
  });

// 2. PROPERTY OWNER NOTIFICATION (to owner when guest checks in)
exports.sendOwnerCheckInNotification = functions.firestore
  .document('Checkins/{checkinId}')
  .onCreate(async (snapshot, context) => {
    const checkinData = snapshot.data();
    
    try {
      // Get hotel owner email from Hotels collection
      const hotelDoc = await admin.firestore().collection('Hotels').doc(checkinData.hotelId).get();
      if (!hotelDoc.exists) {
        console.log('Hotel not found:', checkinData.hotelId);
        return;
      }
      
      const hotelData = hotelDoc.data();
      const ownerEmail = hotelData.ownerEmail;
      
      await postmarkClient.sendEmail({
        "From": "notifications@bookello.com",
        "To": ownerEmail,
        "Subject": `🎉 New Guest Check-in - ${checkinData.guestName}`,
        "HtmlBody": `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">New Guest Check-in! 🎉</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">${checkinData.hotel}</p>
            </div>
            
            <div style="padding: 30px;">
              <p>Hello <strong>${hotelData.ownerName}</strong>,</p>
              <p>You have a new guest check-in at your property <strong>${checkinData.hotel}</strong>.</p>
              
              <div style="background: #f0fff4; padding: 20px; border-radius: 10px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #2d3748;">Guest Information</h3>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Guest Name:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.guestName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Phone:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Nationality:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.nationality}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Check-in Date:</strong></td>
                    <td style="padding: 8px 0;">${new Date(checkinData.checkInDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Check-out Date:</strong></td>
                    <td style="padding: 8px 0;">${new Date(checkinData.checkOutDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Amount:</strong></td>
                    <td style="padding: 8px 0;">$${checkinData.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Booking Source:</strong></td>
                    <td style="padding: 8px 0;">${checkinData.source}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="https://yourapp.com/owner/dashboard" style="background: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View in Dashboard
                </a>
              </div>
            </div>
          </div>
        `,
        "MessageStream": "transactional"
      });

      await snapshot.ref.update({ ownerNotificationSent: true });
      console.log('Owner notification sent to:', ownerEmail);
    } catch (error) {
      console.error('Error sending owner notification:', error);
    }
  });

// 3. ADDITIONAL SERVICES EMAIL (to guest 1 hour after check-in)
exports.sendAdditionalServicesEmail = functions.pubsub.schedule('0 * * * *').onRun(async (context) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentCheckins = await admin.firestore()
      .collection('Checkins')
      .where('submittedAt', '>=', oneHourAgo.toISOString())
      .where('servicesEmailSent', '==', false)
      .get();

    const promises = recentCheckins.docs.map(async (doc) => {
      const checkinData = doc.data();
      
      await postmarkClient.sendEmail({
        "From": "services@bookello.com",
        "To": checkinData.email,
        "Subject": "🌟 Enhance Your Stay with Bookello Services",
        "HtmlBody": `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Make Your Stay Perfect! 🌟</h1>
            </div>
            
            <div style="padding: 30px;">
              <p>Dear <strong>${checkinData.guestName}</strong>,</p>
              <p>We hope you're settling in well at <strong>${checkinData.hotel}</strong>!</p>
              <p>Did you know Bookello offers additional services to enhance your travel experience?</p>
              
              <div style="margin: 25px 0;">
                <div style="border: 1px solid #e2e8f0; padding: 20px; margin: 15px 0; border-radius: 8px; background: #f7fafc;">
                  <h3 style="margin-top: 0; color: #2d3748;">🏠 Property Management</h3>
                  <p style="color: #4a5568;">Professional property management services for homeowners.</p>
                  <a href="https://bookello.com/services/property-management" style="color: #4299e1; text-decoration: none; font-weight: bold;">Learn More →</a>
                </div>
                
                <div style="border: 1px solid #e2e8f0; padding: 20px; margin: 15px 0; border-radius: 8px; background: #f7fafc;">
                  <h3 style="margin-top: 0; color: #2d3748;">🧹 Cleaning Services</h3>
                  <p style="color: #4a5568;">Professional cleaning before, during, or after your stay.</p>
                  <a href="https://bookello.com/services/cleaning" style="color: #4299e1; text-decoration: none; font-weight: bold;">Book Cleaning →</a>
                </div>
                
                <div style="border: 1px solid #e2e8f0; padding: 20px; margin: 15px 0; border-radius: 8px; background: #f7fafc;">
                  <h3 style="margin-top: 0; color: #2d3748;">🚗 Transportation</h3>
                  <p style="color: #4a5568;">Airport transfers and local transportation services.</p>
                  <a href="https://bookello.com/services/transportation" style="color: #4299e1; text-decoration: none; font-weight: bold;">Arrange Ride →</a>
                </div>
              </div>
              
              <p>Need anything else? Reply to this email - we're here to help!</p>
            </div>
          </div>
        `,
        "MessageStream": "transactional"
      });

      await doc.ref.update({ servicesEmailSent: true });
    });

    await Promise.all(promises);
    console.log(`Additional services emails sent: ${promises.length}`);
  } catch (error) {
    console.error('Error sending services emails:', error);
  }
});

// 4. CHECK-OUT THANK YOU EMAIL (to guest on check-out day)
exports.sendCheckOutThankYou = functions.pubsub.schedule('0 9 * * *').onRun(async (context) => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const checkoutsSnapshot = await admin.firestore()
      .collection('Checkins')
      .where('checkOutDate', '==', today)
      .where('checkOutThankYouSent', '==', false)
      .get();

    const promises = checkoutsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      
      await postmarkClient.sendEmail({
        "From": "thankyou@bookello.com",
        "To": data.email,
        "Subject": "Thank You for Staying With Us! 🌟",
        "HtmlBody": `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Thank You for Your Stay! 🌟</h1>
            </div>
            
            <div style="padding: 30px;">
              <p>Dear <strong>${data.guestName}</strong>,</p>
              <p>As your check-out day arrives, we wanted to thank you for choosing <strong>${data.hotel}</strong>.</p>
              
              <p>We hope you had a wonderful stay and created beautiful memories!</p>
              
              <div style="background: #fffaf0; border: 1px solid #fed7d7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #744210;">💫 We'd Love Your Feedback</h3>
                <p style="color: #744210;">Help us improve and help other travelers by leaving a review:</p>
                <div style="text-align: center; margin-top: 15px;">
                  <a href="https://bookello.com/review/${doc.id}" style="background: #48bb78; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Leave a Review
                  </a>
                </div>
              </div>
              
              <p>Looking forward to hosting you again in the future!</p>
              <p style="color: #718096;">Warm regards,<br>The ${data.hotel} Team</p>
            </div>
          </div>
        `,
        "MessageStream": "transactional"
      });

      await doc.ref.update({ checkOutThankYouSent: true });
    });

    await Promise.all(promises);
    console.log(`Check-out thank you emails sent: ${promises.length}`);
  } catch (error) {
    console.error('Error sending check-out emails:', error);
  }
});

// 5. PROPERTY REGISTRATION CONFIRMATION (to owner after registration)
exports.sendPropertyRegistrationConfirmation = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snapshot, context) => {
    const registrationData = snapshot.data();
    
    try {
      await postmarkClient.sendEmail({
        "From": "welcome@bookello.com",
        "To": registrationData.ownerEmail,
        "Subject": `🏠 Property Registered - ${registrationData.hotelName}`,
        "HtmlBody": `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Property Successfully Registered! 🎉</h1>
            </div>
            
            <div style="padding: 30px;">
              <p>Hello <strong>${registrationData.ownerName}</strong>,</p>
              <p>Congratulations! Your property <strong>${registrationData.hotelName}</strong> has been successfully registered in our system.</p>
              
              <div style="background: #ebf8ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #2d3748;">Registration Details</h3>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Property:</strong></td>
                    <td style="padding: 8px 0;">${registrationData.hotelName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Location:</strong></td>
                    <td style="padding: 8px 0;">${registrationData.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Rooms:</strong></td>
                    <td style="padding: 8px 0;">${registrationData.roomCount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #4a5568;"><strong>Registration Date:</strong></td>
                    <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <ul style="color: #4a5568;">
                <li>Our team will review your application within 24-48 hours</li>
                <li>You'll receive an email once approved</li>
                <li>After approval, you can select your subscription plan</li>
                <li>Once payment is processed, your QR code will be activated</li>
              </ul>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="https://bookello.com/owner/dashboard" style="background: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        `,
        "MessageStream": "transactional"
      });

      await snapshot.ref.update({ registrationEmailSent: true });
      console.log('Property registration confirmation sent to:', registrationData.ownerEmail);
    } catch (error) {
      console.error('Error sending registration confirmation:', error);
    }
  });

// 6. SUBSCRIPTION RENEWAL REMINDER (7 days before expiry)
exports.sendSubscriptionRenewalReminder = functions.pubsub.schedule('0 9 * * *').onRun(async (context) => {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const expiryDate = sevenDaysFromNow.toISOString().split('T')[0];
  
  try {
    const expiringSubscriptions = await admin.firestore()
      .collection('Hotels')
      .where('subscription.expiryDate', '==', expiryDate)
      .where('subscription.renewalReminderSent', '==', false)
      .get();

    const promises = expiringSubscriptions.docs.map(async (doc) => {
      const hotel = doc.data();
      
      await postmarkClient.sendEmail({
        "From": "billing@bookello.com",
        "To": hotel.ownerEmail,
        "Subject": "🔔 Subscription Renewal Reminder",
        "HtmlBody": `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Subscription Renewal Reminder</h1>
            </div>
            
            <div style="padding: 30px;">
              <p>Hello <strong>${hotel.ownerName}</strong>,</p>
              <p>This is a friendly reminder that your <strong>${hotel.subscription.plan.toUpperCase()}</strong> subscription for <strong>${hotel.name}</strong> will expire in 7 days.</p>
              
              <div style="background: #fffaf0; border: 1px solid #fed7d7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #744210;">Subscription Details</h3>
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #744210;"><strong>Plan:</strong></td>
                    <td style="padding: 8px 0;">${hotel.subscription.plan.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #744210;"><strong>Expiry Date:</strong></td>
                    <td style="padding: 8px 0;">${hotel.subscription.expiryDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #744210;"><strong>Amount:</strong></td>
                    <td style="padding: 8px 0;">$${hotel.subscription.amount}</td>
                  </tr>
                </table>
              </div>
              
              <p>To avoid any interruption in service, please renew your subscription:</p>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="https://bookello.com/billing/renew" style="background: #48bb78; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Renew Subscription
                </a>
              </div>
              
              <p style="color: #718096; margin-top: 25px;">If you have any questions, reply to this email or contact our support team.</p>
            </div>
          </div>
        `,
        "MessageStream": "transactional"
      });

      await doc.ref.update({ 'subscription.renewalReminderSent': true });
    });

    await Promise.all(promises);
    console.log(`Renewal reminders sent: ${promises.length}`);
  } catch (error) {
    console.error('Error sending renewal reminders:', error);
  }
});

// 7. ACCOUNT ACTIVATION CONFIRMATION (after payment)
exports.sendAccountActivationConfirmation = functions.firestore
  .document('Hotels/{hotelId}')
  .onUpdate(async (change, context) => {
    const afterData = change.after.data();
    const beforeData = change.before.data();
    
    // Send activation email when hotel becomes active
    if (!beforeData.isActive && afterData.isActive && afterData.subscription?.status === 'active') {
      try {
        await postmarkClient.sendEmail({
          "From": "activation@bookello.com",
          "To": afterData.ownerEmail,
          "Subject": "🎉 Your Bookello Account is Now Active!",
          "HtmlBody": `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Welcome Aboard! 🎉</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Your Bookello Account is Now Active</p>
              </div>
              
              <div style="padding: 30px;">
                <p>Hello <strong>${afterData.ownerName}</strong>,</p>
                <p>Great news! Your payment has been processed successfully and your account is now fully activated.</p>
                
                <div style="background: #f0fff4; border: 1px solid #9ae6b4; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #22543d;">Account Activated Successfully ✓</h3>
                  <table style="width: 100%;">
                    <tr>
                      <td style="padding: 8px 0; color: #22543d;"><strong>Property:</strong></td>
                      <td style="padding: 8px 0;">${afterData.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #22543d;"><strong>Plan:</strong></td>
                      <td style="padding: 8px 0;">${afterData.subscription.plan.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #22543d;"><strong>Billing:</strong></td>
                      <td style="padding: 8px 0;">${afterData.subscription.billingPeriod}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #22543d;"><strong>Activation Date:</strong></td>
                      <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
                    </tr>
                  </table>
                </div>
                
                <p><strong>You can now:</strong></p>
                <ul style="color: #4a5568;">
                  <li>Access your unique QR code for guest check-ins</li>
                  <li>View and manage guest registrations</li>
                  <li>Access analytics and reports</li>
                  <li>Manage your property settings</li>
                </ul>
                
                <div style="text-align: center; margin-top: 25px;">
                  <a href="https://bookello.com/owner/dashboard" style="background: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                    Go to Dashboard
                  </a>
                  <a href="https://bookello.com/help" style="background: #718096; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                    Get Help
                  </a>
                </div>
              </div>
            </div>
          `,
          "MessageStream": "transactional"
        });

        await change.after.ref.update({ activationEmailSent: true });
        console.log('Account activation confirmation sent to:', afterData.ownerEmail);
      } catch (error) {
        console.error('Error sending activation confirmation:', error);
      }
    }
  });



exports.syncHotelToSheets = functions.firestore
  .document('registrations/{docId}')
  .onCreate(async (snapshot, context) => {
    const hotelData = snapshot.data();
    
    try {
      await axios.post('https://sheet.best/api/sheets/YOUR_SHEET_ID', {
        'Hotel Name': hotelData.hotelName,
        'Owner Name': hotelData.ownerName,
        'Email': hotelData.ownerEmail,
        'Phone': hotelData.ownerPhone,
        'Location': hotelData.location,
        'Status': 'pending',
        'Created Date': new Date().toISOString()
      });
      
      console.log('Synced to Sheets:', hotelData.hotelName);
    } catch (error) {
      console.error('Sheets sync failed:', error);
    }
  });

  // 8. ADMIN NOTIFICATION - When property registers
exports.sendAdminPropertyRegistrationNotification = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snapshot, context) => {
    const registrationData = snapshot.data();
    
    try {
      // Get admin emails from users collection where role is 'admin'
      const adminUsers = await admin.firestore()
        .collection('users')
        .where('role', 'in', ['admin', 'super_admin'])
        .where('notificationPreferences.propertyRegistration', '==', true)
        .get();
      
      const adminEmails = [];
      adminUsers.forEach(doc => {
        const userData = doc.data();
        if (userData.email) {
          adminEmails.push(userData.email);
        }
      });
      
      // If no admin emails found, use a default admin email
      if (adminEmails.length === 0) {
        adminEmails.push(functions.config().admin.email || 'katabogamadallas@gmail.com');
      }
      
      // Send email to each admin
      const emailPromises = adminEmails.map(async (adminEmail) => {
        await postmarkClient.sendEmail({
          "From": "notifications@bookello.com",
          "To": adminEmail,
          "Subject": `📝 New Property Registration - ${registrationData.hotelName}`,
          "HtmlBody": `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">New Property Registration</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Requires Admin Review</p>
              </div>
              
              <div style="padding: 25px;">
                <p>Hello Admin,</p>
                <p>A new property has been registered and requires your review.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2d3748;">Property Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568; width: 120px;"><strong>Property Name:</strong></td>
                      <td style="padding: 8px 0;">${registrationData.hotelName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Owner:</strong></td>
                      <td style="padding: 8px 0;">${registrationData.ownerName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Email:</strong></td>
                      <td style="padding: 8px 0;">${registrationData.ownerEmail}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Phone:</strong></td>
                      <td style="padding: 8px 0;">${registrationData.ownerPhone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Location:</strong></td>
                      <td style="padding: 8px 0;">${registrationData.location}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Rooms:</strong></td>
                      <td style="padding: 8px 0;">${registrationData.roomCount}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Registered:</strong></td>
                      <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background: #e8f4fd; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #2c5282;">
                    <strong>Action Required:</strong> Please review this application in the admin dashboard.
                  </p>
                </div>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #718096; font-size: 12px;">
                    This is an automated notification from Bookello Admin System.
                  </p>
                </div>
              </div>
            </div>
          `,
          "MessageStream": "transactional",
          "Tag": "admin-notification"
        });
      });
      
      await Promise.all(emailPromises);
      
      // Update the registration document
      await snapshot.ref.update({ adminNotificationSent: true });
      console.log('Admin notification sent for registration:', registrationData.hotelName);
      
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  });


  exports.sendPropertyApprovedEmail = functions.firestore
  .document('registrations/{registrationId}')
  .onUpdate(async (change, context) => {  // ✅ CHANGED FROM onCreate TO onUpdate
    const before = change.before.data();
    const after = change.after.data();
    
    console.log('🚀 FUNCTION TRIGGERED - Status:', after.status);
    console.log('📧 Email already sent?', after.approvalEmailSent);
    console.log('📊 Before status:', before.status, '→ After status:', after.status);
    
    // ✅ IMPROVED LOGIC: Only send email when status CHANGES to approved
    if (
      after.status === 'approved' && 
      before.status !== 'approved' &&  // Status just changed to approved
      !after.approvalEmailSent  // Email not already sent
    ) {
      console.log('✅ Conditions met - Sending approval email to:', after.ownerEmail);
      
      try {
        await postmarkClient.sendEmail({
          "From": "approval@bookello.com",
          "To": after.ownerEmail,
          "Subject": `🎉 Your Property "${after.hotelName}" Has Been Approved!`,
          "HtmlBody": `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 32px;">Congratulations! 🎉</h1>
                <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.95;">Your Property Has Been Approved</p>
              </div>
              
              <div style="padding: 30px;">
                <p>Dear <strong>${after.ownerName}</strong>,</p>
                
                <p>Great news! Your property <strong>"${after.hotelName}"</strong> has been approved and is now active on Bookello.</p>
                
                <div style="background: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 25px 0; border-radius: 8px;">
                  <h3 style="margin-top: 0; color: #2d3748;">🎁 Free Trial Activated</h3>
                  <p style="margin: 0; color: #2d3748;">You have received a <strong>30-day free trial</strong> to explore all Bookello features!</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #2d3748;">Property Details</h3>
                  <table style="width: 100%;">
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Property:</strong></td>
                      <td style="padding: 8px 0;">${after.hotelName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Location:</strong></td>
                      <td style="padding: 8px 0;">${after.location}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4a5568;"><strong>Rooms:</strong></td>
                      <td style="padding: 8px 0;">${after.roomCount}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background: #ebf8ff; border-left: 4px solid #4299e1; padding: 20px; margin: 25px 0; border-radius: 8px;">
                  <h3 style="margin-top: 0; color: #2c5282;">Next Steps</h3>
                  <ol style="color: #2c5282; margin: 10px 0; padding-left: 20px;">
                    <li>Login to your dashboard</li>
                    <li>Set up your QR code for guest check-ins</li>
                    <li>Customize your property settings</li>
                    <li>Start accepting digital check-ins!</li>
                  </ol>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://bookello.life/owner/login" 
                     style="display: inline-block; background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); 
                            color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; 
                            font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(66, 153, 225, 0.3);">
                    Login to Dashboard
                  </a>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                  <p style="color: #718096; font-size: 14px; margin: 0;">
                    <strong>Login Credentials:</strong><br>
                    Email: ${after.ownerEmail}<br>
                    Password: Use the password you created during registration
                  </p>
                </div>
                
                <p style="margin-top: 25px; color: #4a5568;">
                  If you have any questions or need assistance, feel free to reply to this email.
                </p>
                
                <p style="color: #718096; margin-top: 20px;">
                  Best regards,<br>
                  <strong>The Bookello Team</strong>
                </p>
              </div>
              
              <div style="background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">© 2026 Bookello. All rights reserved.</p>
                <p style="margin: 10px 0 0;">Digital Check-in System for Modern Properties</p>
              </div>
            </div>
          `,
          "MessageStream": "transactional"
        });
        
        console.log('✅ Email sent successfully!');
        
        // Mark email as sent
        await change.after.ref.update({
          approvalEmailSent: true,
          approvalEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Document updated with email status');
        
      } catch (error) {
        console.error('❌ Email error:', error.message);
        console.error('Full error:', error);
        
        // Log the error but don't fail the function
        await change.after.ref.update({
          approvalEmailError: error.message,
          approvalEmailAttemptedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } else {
      console.log('⏭️ Skipping email - Conditions not met');
      console.log('Status check:', {
        isApproved: after.status === 'approved',
        statusChanged: before.status !== 'approved',
        emailNotSent: !after.approvalEmailSent
      });
    }
  });


exports.testSendApprovalEmail = functions.https.onRequest(async (req, res) => {
  try {
    const registrationId = req.query.registrationId;
    
    if (!registrationId) {
      return res.status(400).send('Missing registrationId');
    }
    
    const registrationDoc = await admin.firestore()
      .collection('registrations')
      .doc(registrationId)
      .get();
    
    if (!registrationDoc.exists) {
      return res.status(404).send('Registration not found');
    }
    
    const registration = registrationDoc.data();
    
    // Simulate the approval email
    await postmarkClient.sendEmail({
      "From": "approval@bookello.com",
      "To": registration.ownerEmail,
      "Subject": `🎉 TEST: Your Property "${registration.hotelName}" Has Been Approved!`,
      "HtmlBody": `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">TEST: Approved! 🎉</h1>
            <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.95;">This is a test email</p>
          </div>
          
          <div style="padding: 30px;">
            <p>Dear <strong>${registration.ownerName}</strong>,</p>
            <p>This is a TEST email for your property <strong>"${registration.hotelName}"</strong>.</p>
            <p>If you're seeing this, the email system is working!</p>
          </div>
        </div>
      `,
      "MessageStream": "transactional"
    });
    
    await registrationDoc.ref.update({ 
      testEmailSent: true,
      testEmailSentAt: new Date()
    });
    
    return res.status(200).send(`Test email sent to ${registration.ownerEmail}`);
    
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).send('Error: ' + error.message);
  }
});