// functions/index.js - ES MODULES SYNTAX
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { ServerClient } from 'postmark';


initializeApp();
const db = getFirestore();
const postmarkClient = new ServerClient("417936d6-f508-4fcf-8060-faaf1654941f");

// ====================
// 1. REGISTRATION EMAIL (Firestore Trigger)
// ====================
export const sendRegistrationEmail = onDocumentCreated(
  'registrations/{hotelId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const registrationData = snapshot.data();
    const hotelId = event.params.hotelId;

    // Check if email already sent
    if (registrationData.registrationEmailSent) {
      console.log('Email already sent for:', hotelId);
      return;
    }

    try {
      const response = await postmarkClient.sendEmail({
        From: 'checkin@bookello.life',
        To: registrationData.ownerEmail,
        Subject: 'Property Registration Received – Under Review',
        HtmlBody: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
              .header { background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
              h2 { color: #1e40af; margin-top: 0; }
              .checklist { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin:0; font-size: 28px;">Bookello</h1>
              <p style="margin:10px 0 0; opacity:0.9;">Property Registration Portal</p>
            </div>
            
            <div class="content">
              <h2>Property Registration — PENDING APPROVAL</h2>
              
              <p>Hello <strong>${registrationData.ownerName}</strong>,</p>
              
              <p>Thank you for registering your property <strong>${registrationData.hotelName}</strong> on <strong>Bookello</strong>.</p>
              
              <p>Your application is currently under review by our verification team.</p>
              
              <div class="checklist">
                <p style="margin-top:0;"><strong>What happens next:</strong></p>
                <ul>
                  <li>We review property details and documents</li>
                  <li>Verification may take <strong>24–72 hours</strong></li>
                  <li>You will receive an email once approved or declined</li>
                </ul>
              </div>
              
              <p>No action is required from you at this time.</p>
              
              <div class="signature">
                <p style="margin-bottom:5px;">Kind regards,</p>
                <p style="margin:0; font-weight:bold; color:#2563eb;">Bookello Onboarding Team</p>
                <p><a href="https://marketplace.bookello.life">https://marketplace.bookello.life</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
        TextBody: `Hello ${registrationData.ownerName},\n\nThank you for registering your property "${registrationData.hotelName}" on Bookello.\n\nYour application is under review (24-72 hours).\n\nBest regards,\nBookello Team`,
        MessageStream: 'outbound'
      });

      console.log('✅ Registration email sent successfully:', response.MessageID);

      // Update Firestore to mark email as sent
      await db.collection('registrations').doc(hotelId).update({
        registrationEmailSent: true,
        registrationEmailSentAt: new Date(),
        registrationEmailMessageId: response.MessageID
      });

      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('❌ Error sending registration email:', error);
      
      // Log error to Firestore for debugging
      await db.collection('emailErrors').add({
        hotelId,
        type: 'registration',
        error: error.message,
        timestamp: new Date()
      });
      
      throw new Error(`Failed to send registration email: ${error.message}`);
    }
  }
);



// ====================
// 2. GUEST CHECK-IN CONFIRMATION EMAIL
// ====================
export const sendGuestCheckinConfirmation = onDocumentCreated(
  'Checkins/{checkinId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const checkinData = snapshot.data();
    const checkinId = event.params.checkinId;

    // Check if confirmation email already sent
    if (checkinData.confirmationEmailSent) {
      console.log('Guest confirmation email already sent for:', checkinId);
      return;
    }

    try {
      // Send email to guest
      const response = await postmarkClient.sendEmail({
        From: 'checkin@bookello.life',
        To: checkinData.email,
        Subject: `Check-In Completed – ${checkinData.hotel}`,
        HtmlBody: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
              .header { background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
              h2 { color: #1e40af; margin-top: 0; }
              .details { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; }
              .detail-row { display: flex; margin-bottom: 10px; }
              .detail-label { font-weight: bold; min-width: 120px; color: #4b5563; }
              .detail-value { color: #111827; }
              .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
              .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px; }
              .emoji { font-size: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin:0; font-size: 28px;">Bookello Check-In</h1>
              <p style="margin:10px 0 0; opacity:0.9;">Digital Check-In Confirmation</p>
            </div>
            
            <div class="content">
              <h2>Check-In Completed Successfully</h2>
              
              <p>Hello <strong>${checkinData.guestName}</strong>,</p>
              
              <p>Your check-in at <strong>${checkinData.hotel}</strong> has been completed successfully.</p>
              
              <div class="details">
                <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">Stay Details</h3>
                
                <div class="detail-row">
                  <div class="detail-label">Property:</div>
                  <div class="detail-value">${checkinData.hotel}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Check-in Date:</div>
                  <div class="detail-value">${new Date(checkinData.checkInDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Check-out Date:</div>
                  <div class="detail-value">${new Date(checkinData.checkOutDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
              </div>
              
              <p>If you need assistance during your stay, please contact the property reception.</p>
              
              <div class="footer">
                <p style="margin:0; font-size: 18px;" class="emoji">💹</p>
                <p style="margin:10px 0 0; font-weight: bold; color: #2563eb;">
                  We wish you a pleasant stay in Rwanda
                </p>
              </div>
              
              <div class="signature">
                <p style="margin-bottom:5px;">Warm regards,</p>
                <p style="margin:0; font-weight:bold; color:#2563eb;">Check-In by Bookello</p>
              </div>
            </div>
          </body>
          </html>
        `,
        TextBody: `Hello ${checkinData.guestName},\n\nYour check-in at ${checkinData.hotel} has been completed successfully.\n\nStay Details:\n• Property: ${checkinData.hotel}\n• Check-in Date: ${checkinData.checkInDate}\n• Check-out Date: ${checkinData.checkOutDate}\n\nIf you need assistance during your stay, please contact the property reception.\n\nWe wish you a pleasant stay in Rwanda 💹\n\nWarm regards,\nCheck-In by Bookello`,
        MessageStream: 'outbound'
      });

      console.log('✅ Guest check-in confirmation email sent:', response.MessageID);

      // Update Firestore to mark email as sent
      await snapshot.ref.update({
        confirmationEmailSent: true,
        confirmationEmailSentAt: new Date(),
        confirmationEmailMessageId: response.MessageID
      });

      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('❌ Error sending guest check-in confirmation:', error);
      
      // Log error to Firestore for debugging
      await db.collection('emailErrors').add({
        checkinId,
        type: 'guest_checkin_confirmation',
        error: error.message,
        timestamp: new Date()
      });
      
      throw new Error(`Failed to send guest check-in confirmation: ${error.message}`);
    }
  }
);


// ====================
// 3. PROVIDER CHECK-IN NOTIFICATION EMAIL - FIXED
// ====================
export const sendProviderCheckinNotification = onDocumentCreated(
  'Checkins/{checkinId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const checkinData = snapshot.data();
    const checkinId = event.params.checkinId;

    console.log('═══════════════════════════════════════════');
    console.log('🚀 PROVIDER CHECK-IN NOTIFICATION');
    console.log('📄 Check-in ID:', checkinId);
    console.log('🏨 Hotel ID:', checkinData.hotelId);
    console.log('👤 Guest:', checkinData.guestName);

    // Check if provider notification already sent
    if (checkinData.ownerNotificationSent) {
      console.log('⏭️  SKIP - Provider notification already sent');
      return;
    }

    try {
      // Get hotel owner email
      if (!checkinData.hotelId) {
        console.error('❌ Hotel ID is missing from checkin data');
        await snapshot.ref.update({
          ownerNotificationError: 'Hotel ID missing from checkin data',
          ownerNotificationAttemptedAt: new Date()
        });
        return;
      }

      const hotelDoc = await db.collection('Hotels').doc(checkinData.hotelId).get();
      
      // FIXED: Use .exists property (not .exists() method)
      if (!hotelDoc.exists) {
        console.error('❌ Hotel not found for ID:', checkinData.hotelId);
        await snapshot.ref.update({
          ownerNotificationError: `Hotel not found: ${checkinData.hotelId}`,
          ownerNotificationAttemptedAt: new Date()
        });
        return;
      }
      
      const hotelData = hotelDoc.data();
      console.log('🏨 Hotel Data:', hotelData);
      
      const ownerEmail = hotelData.ownerEmail;
      const ownerName = hotelData.ownerName || 'Property Owner';

      if (!ownerEmail) {
        console.error('❌ Owner email not found in hotel data');
        await snapshot.ref.update({
          ownerNotificationError: 'Owner email not found',
          ownerNotificationAttemptedAt: new Date()
        });
        return;
      }

      console.log('📧 Sending to:', ownerEmail);
      console.log('👤 Owner name:', ownerName);

      // Format dates for better readability
      const formatDate = (dateString) => {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        } catch (error) {
          return dateString;
        }
      };

      const formattedCheckIn = formatDate(checkinData.checkInDate);
      const formattedCheckOut = formatDate(checkinData.checkOutDate);

      // Send email to provider
      const response = await postmarkClient.sendEmail({
        From: 'checkin@bookello.life',
        To: ownerEmail,
        Subject: `✅ New Check-in: ${checkinData.guestName}`,
        HtmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; font-size: 20px;">New Guest Check-in</h2>
              <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">${hotelData.name || checkinData.hotel}</p>
            </div>
            <div style="background: #ffffff; padding: 25px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
              <p>Hello <strong>${ownerName}</strong>,</p>
              <p>A new guest has checked in at your property.</p>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #48bb78;">
                <h3 style="margin-top: 0; color: #2d3748;">Guest Details</h3>
                <p style="margin: 8px 0;"><strong>👤 Guest:</strong> ${checkinData.guestName}</p>
                <p style="margin: 8px 0;"><strong>📅 Dates:</strong> ${formattedCheckIn} - ${formattedCheckOut}</p>
                <p style="margin: 8px 0;"><strong>🌍 Nationality:</strong> ${checkinData.nationality}</p>
                <p style="margin: 8px 0;"><strong>📞 Contact:</strong> ${checkinData.phone}</p>
                <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${checkinData.email}</p>
                <p style="margin: 8px 0;"><strong>💰 Amount:</strong> ${checkinData.amount} rwf </p>
                <p style="margin: 8px 0;"><strong>💳 Payment:</strong> ${checkinData.paymentMethod === 'cash' ? 'Cash' : 'Card'}</p>
                <p style="margin: 8px 0;"><strong>📋 Source:</strong> ${checkinData.source}</p>
              </div>
              
              <p style="font-size: 14px; color: #4a5568;">
                Documents have been uploaded and are available in your dashboard.
              </p>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #718096;">
                  This is an automated notification from Bookello Check-in System.
                </p>
              </div>
            </div>
          </div>
        `,
        TextBody: `New Guest Check-in\n\nHello ${ownerName},\n\nA new guest has checked in at your property:\n\n• Guest: ${checkinData.guestName}\n• Dates: ${formattedCheckIn} - ${formattedCheckOut}\n• Nationality: ${checkinData.nationality}\n• Phone: ${checkinData.phone}\n• Email: ${checkinData.email}\n• Amount: $${checkinData.amount}\n• Payment: ${checkinData.paymentMethod === 'cash' ? 'Cash' : 'Card'}\n• Source: ${checkinData.source}\n\nDocuments have been uploaded and are available in your dashboard.\n\nThis is an automated notification from Bookello Check-in System.`,
        MessageStream: 'outbound',
        Tag: 'provider-checkin'
      });

      console.log('✅ Provider notification sent:', response.MessageID);

      // Update Firestore to mark email as sent
      await snapshot.ref.update({
        ownerNotificationSent: true,
        ownerNotificationSentAt: new Date(),
        ownerNotificationMessageId: response.MessageID
      });

      console.log('✅ Firestore updated successfully');
      console.log('═══════════════════════════════════════════');
      return { success: true, messageId: response.MessageID };

    } catch (error) {
      console.error('❌ Error sending provider notification:', error.message);
      console.error('Full error:', error);

      // Log error to Firestore
      await db.collection('emailErrors').add({
        checkinId,
        type: 'provider_checkin_notification',
        error: error.message,
        timestamp: new Date(),
        hotelId: checkinData.hotelId,
        guestName: checkinData.guestName
      });

      // Update checkin with error
      await snapshot.ref.update({
        ownerNotificationError: error.message,
        ownerNotificationAttemptedAt: new Date()
      });

      throw new Error(`Failed to send provider notification: ${error.message}`);
    }
  }
);


// ====================
// 4. BOOKELLO MARKETPLACE SERVICES EMAIL (updated - no delay blocking check-in)
// ====================
export const sendMarketplaceServicesEmail = onDocumentCreated(
  'Checkins/{checkinId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const checkinData = snapshot.data();
    const checkinId = event.params.checkinId;

    if (checkinData.servicesEmailSent) {
      console.log('Marketplace services email already sent for:', checkinId);
      return;
    }

   
    setTimeout(async () => {
      try {
        // Wait 5 minutes before sending services email
        console.log('⏰ Waiting 5 minutes before sending services email for:', checkinId);
        await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
        
        // Re-fetch the document to ensure it still exists and email not already sent
        const updatedDoc = await snapshot.ref.get();
        if (!updatedDoc.exists) {
          console.log('Check-in document no longer exists:', checkinId);
          return;
        }
        
        const updatedData = updatedDoc.data();
        if (updatedData.servicesEmailSent) {
          console.log('Services email already sent while waiting:', checkinId);
          return;
        }

        console.log('📧 Sending delayed services email for:', checkinId);
        
        const response = await postmarkClient.sendEmail({
          From: 'checkin@bookello.life',
          To: updatedData.email,
          Subject: `Explore Services Near ${updatedData.hotel}`,
          HtmlBody: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
                .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
                h2 { color: #7c3aed; margin-top: 0; }
                .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                .service-item { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
                .service-emoji { font-size: 20px; margin-bottom: 8px; }
                .service-name { font-weight: bold; color: #4b5563; font-size: 14px; }
                .marketplace-link { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
                .marketplace-link:hover { background: #7c3aed; }
                .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin:0; font-size: 28px;">Bookello Marketplace</h1>
                <p style="margin:10px 0 0; opacity:0.9;">Trusted Services Around You</p>
              </div>
              
              <div class="content">
                <h2>Welcome to ${updatedData.hotel}, ${updatedData.guestName}!</h2>
                
                <p>We hope you're settling in well at <strong>${updatedData.hotel}</strong>.</p>
                
                <p>To make your stay easier and more enjoyable, you can use <strong>Bookello Marketplace</strong> to book trusted services around you — all in one place.</p>
                
                <div class="services-grid">
                  <div class="service-item">
                    <div class="service-emoji">🚗</div>
                    <div class="service-name">Car rentals & airport transfers</div>
                  </div>
                  <div class="service-item">
                    <div class="service-emoji">🗺️</div>
                    <div class="service-name">Tours & experiences</div>
                  </div>
                  <div class="service-item">
                    <div class="service-emoji">👨‍🍳</div>
                    <div class="service-name">Private chefs & food services</div>
                  </div>
                  <div class="service-item">
                    <div class="service-emoji">📸</div>
                    <div class="service-name">Photographers & event services</div>
                  </div>
                  <div class="service-item">
                    <div class="service-emoji">💆</div>
                    <div class="service-name">Spa & wellness services</div>
                  </div>
                  <div class="service-item">
                    <div class="service-emoji">🔧</div>
                    <div class="service-name">Skilled workers & local services</div>
                  </div>
                </div>
                
                <p>All providers on Bookello are verified, and you can book securely anytime during your stay.</p>
                
                <a href="https://marketplace.bookello.life" class="marketplace-link">
                  Explore services near you
                </a>
                
                <p style="margin-top: 25px; font-size: 14px; color: #6b7280;">
                  If you need help or recommendations, your host will be happy to assist.
                </p>
                
                <div class="signature">
                  <p style="margin:0; font-weight:bold; color:#8b5cf6;">Bookello Marketplace Team</p>
                </div>
              </div>
            </body>
            </html>
          `,
          TextBody: `Hello ${updatedData.guestName},\n\nWe hope you're settling in well at ${updatedData.hotel}.\n\nTo make your stay easier and more enjoyable, you can use Bookello Marketplace to book trusted services around you:\n\n🚗 Car rentals & airport transfers\n🗺️ Tours & experiences\n👨‍🍳 Private chefs & food services\n📸 Photographers & event services\n💆 Spa & wellness services\n🔧 Skilled workers & local services\n\nAll providers on Bookello are verified.\n\nExplore services: https://marketplace.bookello.life\n\nIf you need help or recommendations, your host will be happy to assist.\n\nBookello Marketplace Team`,
          MessageStream: 'outbound'
        });

        console.log('✅ Delayed services email sent:', response.MessageID);

        // Update Firestore to mark email as sent
        await updatedDoc.ref.update({
          servicesEmailSent: true,
          servicesEmailSentAt: new Date(),
          servicesEmailMessageId: response.MessageID
        });

      } catch (error) {
        console.error('❌ Error sending delayed marketplace services email:', error);
        
        await db.collection('emailErrors').add({
          checkinId,
          type: 'marketplace_services_delayed',
          error: error.message,
          timestamp: new Date()
        });
      }
    }, 1000); // Start the timer 1 second after function execution

    // Return immediately to not block check-in
    console.log('✅ Services email scheduled for 5 minutes from now for:', checkinId);
    return null;
  }
);


// ====================
// 5. CHECK-OUT THANK YOU EMAIL (sent to guest after check-out)
// ====================

export const sendCheckoutThankYouEmail = onCall(async (request) => {
  // This function is called manually by the admin when a guest checks out
  const { checkinId, guestEmail, guestName, hotelName, checkOutDate } = request.data;

  if (!checkinId || !guestEmail) {
    throw new Error('Missing required parameters');
  }

  try {
    const response = await postmarkClient.sendEmail({
      From: 'checkout@bookello.life',
      To: guestEmail,
      Subject: `Thank You for Staying at ${hotelName}`,
      HtmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
            h2 { color: #d97706; margin-top: 0; }
            .thank-you { font-size: 24px; font-weight: bold; color: #d97706; margin: 20px 0; text-align: center; }
            .review-section { background: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fde68a; margin: 20px 0; }
            .review-button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; font-weight: bold; }
            .review-button:hover { background: #d97706; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0; font-size: 28px;">Bookello Check-Out</h1>
            <p style="margin:10px 0 0; opacity:0.9;">Thank You for Your Stay</p>
          </div>
          
          <div class="content">
            <div class="thank-you">Thank You, ${guestName}!</div>
            
            <p>We hope you had a wonderful stay at <strong>${hotelName}</strong>.</p>
            
            <p>Your check-out on <strong>${new Date(checkOutDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</strong> has been processed.</p>
            
            <div class="review-section">
              <h3 style="color: #d97706; margin-top: 0;">Share Your Experience</h3>
              <p>Your feedback helps us improve and helps other travelers make informed decisions.</p>
              
              <a href="https://bookello.life/review/${checkinId}" class="review-button">
                ✍️ Leave a Review
              </a>
            </div>
            
            <p>We would love to welcome you back on your next visit to Rwanda!</p>
            
            <p style="font-size: 18px; text-align: center; margin: 30px 0; color: #d97706;">
              🏆 Thank you for choosing Bookello!
            </p>
            
            <div class="signature">
              <p style="margin-bottom:5px;">Safe travels,</p>
              <p style="margin:0; font-weight:bold; color:#d97706;">The Bookello Team</p>
              <p><a href="https://bookello.life">https://bookello.life</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      TextBody: `Thank You, ${guestName}!\n\nWe hope you had a wonderful stay at ${hotelName}.\n\nYour check-out on ${checkOutDate} has been processed.\n\nShare Your Experience:\nYour feedback helps us improve and helps other travelers make informed decisions.\n\n✍️ Leave a Review: https://bookello.life/review/${checkinId}\n\nWe would love to welcome you back on your next visit to Rwanda!\n\n🏆 Thank you for choosing Bookello!\n\nSafe travels,\nThe Bookello Team\nhttps://bookello.life`,
      MessageStream: 'outbound'
    });

    console.log('✅ Check-out thank you email sent:', response.MessageID);

    // Update check-in record
    const checkinRef = db.collection('Checkins').doc(checkinId);
    await checkinRef.update({
      checkOutThankYouSent: true,
      checkOutThankYouSentAt: new Date(),
      checkOutThankYouMessageId: response.MessageID
    });

    return { 
      success: true, 
      messageId: response.MessageID,
      message: 'Check-out thank you email sent successfully'
    };
  } catch (error) {
    console.error('❌ Error sending check-out thank you email:', error);
    
    // Log error to Firestore for debugging
    await db.collection('emailErrors').add({
      checkinId,
      type: 'checkout_thank_you',
      error: error.message,
      timestamp: new Date()
    });
    
    throw new Error(`Failed to send check-out thank you email: ${error.message}`);
  }
});



// ====================
// 8. ADMIN NOTIFICATION - When property registers
// ====================
export const sendAdminPropertyRegistrationNotification = onDocumentCreated(
  'registrations/{registrationId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const registrationData = snapshot.data();
    const registrationId = event.params.registrationId;
    
    console.log('═══════════════════════════════════════════');
    console.log('🚀 ADMIN NOTIFICATION FUNCTION TRIGGERED');
    console.log('📄 Registration ID:', registrationId);
    console.log('Hotel Name:', registrationData.hotelName);
    console.log('═══════════════════════════════════════════');

    // Check if notification already sent
    if (registrationData.adminNotificationSent) {
      console.log('⏭️  SKIP - Admin notification already sent');
      return;
    }

    try {
      // Get admin emails from users collection where role is 'admin'
      const adminUsers = await db
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
        const defaultEmail = process.env.ADMIN_EMAIL || 'katabogamadallas@gmail.com';
        adminEmails.push(defaultEmail);
      }
      
      console.log('📧 Sending notifications to:', adminEmails);

      const emailPromises = adminEmails.map(async (adminEmail) => {
        try {
          const response = await postmarkClient.sendEmail({
            "From": "checkin@bookello.life",
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
            "TextBody": `New Property Registration - ${registrationData.hotelName}\n\nHello Admin,\n\nA new property has been registered and requires your review.\n\nProperty Details:\n- Property Name: ${registrationData.hotelName}\n- Owner: ${registrationData.ownerName}\n- Email: ${registrationData.ownerEmail}\n- Phone: ${registrationData.ownerPhone || 'N/A'}\n- Location: ${registrationData.location}\n- Rooms: ${registrationData.roomCount}\n\nAction Required: Please review this application in the admin dashboard.\n\nThis is an automated notification from Bookello Admin System.`,
            "MessageStream": "transactional",
            "Tag": "admin-notification"
          });

          console.log(`✅ Admin notification sent to ${adminEmail}:`, response.MessageID);
          return { email: adminEmail, messageId: response.MessageID };
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${adminEmail}:`, emailError.message);
          
          // Log error to Firestore
          await db.collection('emailErrors').add({
            registrationId,
            type: 'admin_notification',
            error: emailError.message,
            timestamp: new Date(),
            adminEmail: adminEmail,
            hotelName: registrationData.hotelName
          });
          
          throw emailError;
        }
      });
      
      const results = await Promise.allSettled(emailPromises);
      
      const successfulEmails = results.filter(result => result.status === 'fulfilled');
      const failedEmails = results.filter(result => result.status === 'rejected');
      
      console.log(`📊 Email Results: ${successfulEmails.length} succeeded, ${failedEmails.length} failed`);
      
      // Update the registration document
      await snapshot.ref.update({ 
        adminNotificationSent: true,
        adminNotificationSentAt: new Date(),
        adminEmailsNotified: adminEmails,
        adminNotificationSuccessCount: successfulEmails.length,
        adminNotificationFailedCount: failedEmails.length
      });
      
      console.log('✅ Firestore updated with admin notification status');
      console.log('═══════════════════════════════════════════');
      
      return { 
        success: true, 
        registrationId,
        totalAdmins: adminEmails.length,
        successfulCount: successfulEmails.length,
        failedCount: failedEmails.length
      };
      
    } catch (error) {
      console.error('❌ Error in admin notification function:', error.message);
      console.error('Full error:', error);

      // Log error to Firestore
      await db.collection('emailErrors').add({
        registrationId,
        type: 'admin_notification',
        error: error.message,
        timestamp: new Date(),
        hotelName: registrationData.hotelName,
        stage: 'main_function_error'
      });

      throw new Error(`Failed to send admin notification: ${error.message}`);
    }
  });


export const sendPropertyApprovedEmail = onDocumentUpdated(
  'registrations/{registrationId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const before = event.data.before.data();
    const after = event.data.after.data();
    const registrationId = event.params.registrationId;

    console.log('═══════════════════════════════════════════');
    console.log('🚀 APPROVAL EMAIL FUNCTION TRIGGERED');
    console.log('📄 Registration ID:', registrationId);
    console.log('BEFORE:', {
      status: before.status,
      approvalEmailSent: before.approvalEmailSent
    });
    console.log('AFTER:', {
      status: after.status,
      approvalEmailSent: after.approvalEmailSent,
      ownerEmail: after.ownerEmail,
      hotelName: after.hotelName
    });
    console.log('═══════════════════════════════════════════');

    // Check conditions
    const isApproved = after.status === 'approved';
    const statusChanged = before.status !== after.status;
    const emailNotSent = !after.approvalEmailSent;

    console.log('✓ Checks:', {
      isApproved,
      statusChanged: `${before.status} → ${after.status}`,
      emailNotSent
    });

    // Skip if conditions not met
    if (!isApproved || !statusChanged || !emailNotSent) {
      console.log('⏭️  SKIP - Conditions not met');
      return;
    }

    console.log('✅ SENDING EMAIL to:', after.ownerEmail);

    try {
      const response = await postmarkClient.sendEmail({
        From: 'checkin@bookello.life',
        To: after.ownerEmail,
        Subject: `🎉 Your Property "${after.hotelName}" Has Been Approved!`,
        HtmlBody: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; color: #333; }
              .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
              h2 { color: #38a169; margin-top: 0; }
              .trial-box { background: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 25px 0; border-radius: 8px; }
              .details-box { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
              .detail-label { font-weight: bold; color: #4a5568; }
              .detail-value { color: #1a202c; }
              .next-steps { background: #ebf8ff; border-left: 4px solid #4299e1; padding: 20px; margin: 25px 0; border-radius: 8px; }
              .next-steps ol { color: #2c5282; margin: 10px 0; padding-left: 20px; }
              .button { display: inline-block; background: #4299e1; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .button:hover { background: #3182ce; }
              .credentials { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px; }
              .footer { background: #2d3748; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">Congratulations! 🎉</h1>
              <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.95;">Your Property Has Been Approved</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${after.ownerName}</strong>,</p>
              
              <p>Great news! Your property <strong>"${after.hotelName}"</strong> has been approved and is now active on Bookello.</p>
              
              <div class="trial-box">
                <h3 style="margin-top: 0; color: #2d3748;">🎁 Free Trial Activated</h3>
                <p style="margin: 0; color: #2d3748;">You have received a <strong>30-day free trial</strong> to explore all Bookello features!</p>
              </div>
              
              <div class="details-box">
                <h3 style="margin-top: 0; color: #2d3748;">Property Details</h3>
                <div class="detail-row">
                  <div class="detail-label">Property:</div>
                  <div class="detail-value">${after.hotelName}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Location:</div>
                  <div class="detail-value">${after.location}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Rooms:</div>
                  <div class="detail-value">${after.roomCount}</div>
                </div>
              </div>
              
              <div class="next-steps">
                <h3 style="margin-top: 0; color: #2c5282;">Next Steps</h3>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>Login to your dashboard</li>
                  <li>Set up your QR code for guest check-ins</li>
                  <li>Customize your property settings</li>
                  <li>Start accepting digital check-ins!</li>
                </ol>
              </div>
              
              <div style="text-align: center;">
                <a href="https://bookello.life/owner/login" class="button">
                  Login to Dashboard
                </a>
              </div>
              
              <div class="credentials">
                <p style="margin: 0;">
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
            
            <div class="footer">
              <p style="margin: 0;">© 2026 Bookello. All rights reserved.</p>
              <p style="margin: 10px 0 0;">Digital Check-in System for Modern Properties</p>
            </div>
          </body>
          </html>
        `,
        TextBody: `Congratulations! Your Property Has Been Approved

Dear ${after.ownerName},

Great news! Your property "${after.hotelName}" has been approved and is now active on Bookello.

🎁 Free Trial Activated
You have received a 30-day free trial to explore all Bookello features!

Property Details:
- Property: ${after.hotelName}
- Location: ${after.location}
- Rooms: ${after.roomCount}

Next Steps:
1. Login to your dashboard
2. Set up your QR code for guest check-ins
3. Customize your property settings
4. Start accepting digital check-ins!

Login to Dashboard: https://bookello.life/owner/login

Login Credentials:
Email: ${after.ownerEmail}
Password: Use the password you created during registration

If you have any questions or need assistance, feel free to reply to this email.

Best regards,
The Bookello Team`,
        MessageStream: 'outbound'
      });

      console.log('✅✅✅ EMAIL SENT! MessageID:', response.MessageID);

      // Update Firestore to mark email as sent
      await event.data.after.ref.update({
        approvalEmailSent: true,
        approvalEmailSentAt: new Date(),
        approvalEmailMessageId: response.MessageID
      });

      console.log('✅ Firestore updated');
      console.log('═══════════════════════════════════════════');

      return { success: true, messageId: response.MessageID };

    } catch (error) {
      console.error('❌ EMAIL FAILED:', error.message);
      console.error('Full error:', error);

      // Log error to Firestore
      await db.collection('emailErrors').add({
        registrationId,
        type: 'property_approval',
        error: error.message,
        timestamp: new Date(),
        ownerEmail: after.ownerEmail,
        hotelName: after.hotelName
      });

      // Update registration with error
      await event.data.after.ref.update({
        approvalEmailError: error.message,
        approvalEmailAttemptedAt: new Date()
      });

      throw new Error(`Failed to send approval email: ${error.message}`);
    }
  }
);


// ====================
// 7. INVOICE CREATED EMAIL (Sent when admin creates invoice)
// ====================
export const sendInvoiceCreatedEmail = onDocumentCreated(
  'invoices/{invoiceId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const invoiceData = snapshot.data();
    const invoiceId = event.params.invoiceId;

    // Check if invoice creation email already sent
    if (invoiceData.invoiceCreatedEmailSent) {
      console.log('Invoice creation email already sent for:', invoiceId);
      return;
    }

    // Only send for invoices created by admin (not system-generated trial invoices)
    if (invoiceData.generatedBy === 'system_auto' || invoiceData.invoiceType === 'trial_end') {
      console.log('System-generated invoice, skipping email');
      return;
    }

    try {
      // Get property details
      let propertyName = invoiceData.hotelName;
      let ownerEmail = invoiceData.ownerEmail;
      let ownerName = invoiceData.ownerName;

      // If property details not in invoice, fetch from Hotels collection
      if (!propertyName || !ownerEmail || !ownerName) {
        const hotelDoc = await db.collection('Hotels').doc(invoiceData.hotelId).get();
        if (hotelDoc.exists()) {
          const hotelData = hotelDoc.data();
          propertyName = propertyName || hotelData.name;
          ownerEmail = ownerEmail || hotelData.ownerEmail;
          ownerName = ownerName || hotelData.ownerName;
        }
      }

      // Format due date
      const dueDate = invoiceData.dueDate?.toDate ? invoiceData.dueDate.toDate() : new Date(invoiceData.dueDate);
      const formattedDueDate = dueDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const response = await postmarkClient.sendEmail({
        From: 'invoices@bookello.life',
        To: ownerEmail,
        Subject: `Invoice ${invoiceData.invoiceNumber} – Payment Required`,
        HtmlBody: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
              h2 { color: #d97706; margin-top: 0; }
              .invoice-details { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
              .detail-label { font-weight: bold; color: #4b5563; }
              .detail-value { font-weight: bold; color: #111827; }
              .highlight { color: #d97706; }
              .invoice-button { display: inline-block; background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
              .invoice-button:hover { background: #b45309; }
              .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
              .note { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin:0; font-size: 28px;">Bookello</h1>
              <p style="margin:10px 0 0; opacity:0.9;">Invoice Notification</p>
            </div>
            
            <div class="content">
              <h2>Invoice ${invoiceData.invoiceNumber}</h2>
              
              <p>Hello <strong>${ownerName}</strong>,</p>
              
              <p>An invoice has been generated for your property <strong>${propertyName}</strong> on <strong>Bookello</strong>.</p>
              
              <div class="invoice-details">
                <h3 style="color: #d97706; margin-top: 0; margin-bottom: 15px;">Invoice Details</h3>
                
                <div class="detail-row">
                  <div class="detail-label">Invoice Number:</div>
                  <div class="detail-value">${invoiceData.invoiceNumber}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Period:</div>
                  <div class="detail-value">${invoiceData.period || 'Monthly subscription'}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Amount Due:</div>
                  <div class="detail-value">$${invoiceData.amount.toFixed(2)}</div>
                </div>
                
                <div class="detail-row">
                  <div class="detail-label">Due Date:</div>
                  <div class="detail-value highlight">${formattedDueDate}</div>
                </div>
              </div>
              
              <p>🔍 View & download invoice:</p>
              <a href="https://provider.bookello.life/invoices/${invoiceId}" class="invoice-button">
                View Invoice
              </a>
              
              <div class="note">
                <p style="margin:0; font-weight:bold;">💡 Important:</p>
                <p style="margin:5px 0 0;">Once payment is completed, please upload your payment receipt in your dashboard for confirmation.</p>
              </div>
              
              <p>If you have any questions, our support team is ready to assist.</p>
              
              <div class="signature">
                <p style="margin:0; font-weight:bold; color:#d97706;">Bookello Finance Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
        TextBody: `Invoice ${invoiceData.invoiceNumber} – Payment Required\n\nHello ${ownerName},\n\nAn invoice has been generated for your property ${propertyName} on Bookello.\n\nInvoice Details:\n- Invoice Number: ${invoiceData.invoiceNumber}\n- Period: ${invoiceData.period || 'Monthly subscription'}\n- Amount Due: $${invoiceData.amount.toFixed(2)}\n- Due Date: ${formattedDueDate}\n\n🔍 View & download invoice:\nhttps://provider.bookello.life/invoices/${invoiceId}\n\nOnce payment is completed, please upload your payment receipt in your dashboard for confirmation.\n\nIf you have any questions, our support team is ready to assist.`,
        MessageStream: 'outbound'
      });

      console.log('✅ Invoice created email sent:', response.MessageID);

      // Update Firestore to mark email as sent
      await snapshot.ref.update({
        invoiceCreatedEmailSent: true,
        invoiceCreatedEmailSentAt: new Date(),
        invoiceCreatedEmailMessageId: response.MessageID
      });

      return { success: true, messageId: response.MessageID };
    } catch (error) {
      console.error('❌ Error sending invoice created email:', error);
      
      await db.collection('emailErrors').add({
        invoiceId,
        type: 'invoice_created',
        error: error.message,
        timestamp: new Date()
      });
      
      throw new Error(`Failed to send invoice created email: ${error.message}`);
    }
  }
);

// ====================
// 8. PAYMENT CONFIRMED EMAIL (Sent when admin verifies receipt)
// ====================
export const sendPaymentConfirmedEmail = onDocumentUpdated(
  'invoices/{invoiceId}',
  async (event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const invoiceId = event.params.invoiceId;

    // Check if status changed from pending/pending_verification to paid
    const wasPending = beforeData.status === 'pending' || beforeData.status === 'pending_verification';
    const isNowPaid = afterData.status === 'paid';
    const paymentEmailNotSent = !afterData.paymentConfirmedEmailSent;

    if (wasPending && isNowPaid && paymentEmailNotSent) {
      try {
        // Get property details
        let propertyName = afterData.hotelName;
        let ownerEmail = afterData.ownerEmail;
        let ownerName = afterData.ownerName;

        // If property details not in invoice, fetch from Hotels collection
        if (!propertyName || !ownerEmail || !ownerName) {
          const hotelDoc = await db.collection('Hotels').doc(afterData.hotelId).get();
          if (hotelDoc.exists()) {
            const hotelData = hotelDoc.data();
            propertyName = propertyName || hotelData.name;
            ownerEmail = ownerEmail || hotelData.ownerEmail;
            ownerName = ownerName || hotelData.ownerName;
          }
        }

        // Format confirmation date
        const confirmationDate = afterData.verifiedAt?.toDate ? afterData.verifiedAt.toDate() : new Date();
        const formattedConfirmationDate = confirmationDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const response = await postmarkClient.sendEmail({
          From: 'payments@bookello.life',
          To: ownerEmail,
          Subject: `Payment Confirmed – Invoice ${afterData.invoiceNumber}`,
          HtmlBody: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
                h2 { color: #059669; margin-top: 0; }
                .payment-summary { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; }
                .summary-label { font-weight: bold; color: #4b5563; }
                .summary-value { font-weight: bold; color: #111827; }
                .amount { font-size: 24px; color: #059669; }
                .invoice-button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
                .invoice-button:hover { background: #047857; }
                .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
                .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin:0; font-size: 28px;">Bookello</h1>
                <p style="margin:10px 0 0; opacity:0.9;">Payment Confirmation</p>
              </div>
              
              <div class="content">
                <h2>Payment Confirmed</h2>
                
                <p>Hello <strong>${ownerName}</strong>,</p>
                
                <p>Your payment for <strong>Invoice ${afterData.invoiceNumber}</strong> has been confirmed successfully.</p>
                
                <div class="status-badge">
                  ✅ Payment Verified
                </div>
                
                <div class="payment-summary">
                  <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px;">Payment Summary</h3>
                  
                  <div class="summary-row">
                    <div class="summary-label">Property:</div>
                    <div class="summary-value">${propertyName}</div>
                  </div>
                  
                  <div class="summary-row">
                    <div class="summary-label">Amount Paid:</div>
                    <div class="summary-value amount">$${afterData.amount.toFixed(2)}</div>
                  </div>
                  
                  <div class="summary-row">
                    <div class="summary-label">Confirmation Date:</div>
                    <div class="summary-value">${formattedConfirmationDate}</div>
                  </div>
                  
                  <div class="summary-row">
                    <div class="summary-label">Invoice Period:</div>
                    <div class="summary-value">${afterData.period || 'Monthly subscription'}</div>
                  </div>
                </div>
                
                <p>Your account remains active with no outstanding balance.</p>
                
                <p>🔍 View invoice record:</p>
                <a href="https://provider.bookello.life/invoices/${invoiceId}" class="invoice-button">
                  View Invoice Details
                </a>
                
                <div class="signature">
                  <p style="margin-bottom:5px;">Thank you for partnering with <strong>Bookello</strong>.</p>
                  <p style="margin:0; font-weight:bold; color:#059669;">Bookello Finance Team ↓</p>
                </div>
              </div>
            </body>
            </html>
          `,
          TextBody: `Payment Confirmed – Invoice ${afterData.invoiceNumber}\n\nHello ${ownerName},\n\nYour payment for Invoice ${afterData.invoiceNumber} has been confirmed successfully.\n\nPayment Summary\n- Property: ${propertyName}\n- Amount Paid: $${afterData.amount.toFixed(2)}\n- Confirmation Date: ${formattedConfirmationDate}\n- Invoice Period: ${afterData.period || 'Monthly subscription'}\n\nYour account remains active with no outstanding balance.\n\n🔍 View invoice record: https://provider.bookello.life/invoices/${invoiceId}\n\nThank you for partnering with Bookello.\n\nWarm regards,\nBookello Finance Team ↓`,
          MessageStream: 'outbound'
        });

        console.log('✅ Payment confirmed email sent:', response.MessageID);

        // Update Firestore to mark email as sent
        await event.data.after.ref.update({
          paymentConfirmedEmailSent: true,
          paymentConfirmedEmailSentAt: new Date(),
          paymentConfirmedEmailMessageId: response.MessageID
        });

        return { success: true, messageId: response.MessageID };
      } catch (error) {
        console.error('❌ Error sending payment confirmed email:', error);
        
        await db.collection('emailErrors').add({
          invoiceId,
          type: 'payment_confirmed',
          error: error.message,
          timestamp: new Date()
        });
        
        throw new Error(`Failed to send payment confirmed email: ${error.message}`);
      }
    }
    
    return null;
  }
);


// ====================
// CUSTOM BULK EMAIL FUNCTION (Updated)
// ====================
export const sendCustomBulkEmail = onCall(async (request) => {
  const { 
    hotelId, 
    propertyName, 
    propertyWhatsApp, 
    recipients, 
    subject, 
    body, 
    template,
    customEmailAddresses = [] // Add this parameter
  } = request.data;

  if (!hotelId || (!recipients || recipients.length === 0) && (!customEmailAddresses || customEmailAddresses.length === 0)) {
    throw new Error('Missing required parameters: Need either recipients or customEmailAddresses');
  }

  try {
    // Combine both recipients (from guests) and custom email addresses
    const allRecipients = [];
    
    // Add guest recipients
    if (recipients && recipients.length > 0) {
      recipients.forEach(recipient => {
        allRecipients.push({
          email: recipient.email,
          name: recipient.name || 'Guest',
          type: 'guest'
        });
      });
    }
    
    // Add custom email addresses
    if (customEmailAddresses && customEmailAddresses.length > 0) {
      customEmailAddresses.forEach(email => {
        if (email.trim()) {
          allRecipients.push({
            email: email.trim(),
            name: 'Recipient', // Default name for custom emails
            type: 'custom'
          });
        }
      });
    }
    
    if (allRecipients.length === 0) {
      throw new Error('No recipients to send emails to');
    }

    const emailPromises = allRecipients.map(async (recipient) => {
      try {
        // Replace template variables with actual data
        let personalizedBody = body
          .replace(/{{GuestName}}/g, recipient.name)
          .replace(/{{PropertyName}}/g, propertyName)
          .replace(/{{PropertyWhatsApp}}/g, propertyWhatsApp || '');

        const personalizedSubject = subject
          .replace(/{{PropertyName}}/g, propertyName)
          .replace(/{{GuestName}}/g, recipient.name);

        const response = await postmarkClient.sendEmail({
          From: 'checkin@bookello.life',
          To: recipient.email,
          Subject: personalizedSubject,
          HtmlBody: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
                .header { background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8fafc; padding: 25px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
                .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px; text-align: center; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2 style="margin: 0; font-size: 20px;">${propertyName}</h2>
                <p style="margin: 5px 0 0; opacity: 0.9;">${template.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div class="content">
                ${personalizedBody.replace(/\n/g, '<br>')}
                <div class="footer">
                  <p>This email was sent from Bookello Check-in System</p>
                </div>
              </div>
            </body>
            </html>
          `,
          TextBody: personalizedBody,
          MessageStream: 'outbound',
          Tag: `custom-${template}`
        });

        // Log individual email success
        await db.collection('EmailLogs').add({
          hotelId,
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          recipientType: recipient.type,
          subject: personalizedSubject,
          template,
          messageId: response.MessageID,
          sentAt: new Date(),
          status: 'sent'
        });

        return { 
          email: recipient.email, 
          success: true, 
          messageId: response.MessageID,
          type: recipient.type
        };
      } catch (emailError) {
        // Log email failure
        await db.collection('EmailErrors').add({
          hotelId,
          recipientEmail: recipient.email,
          recipientType: 'custom',
          type: 'custom_bulk_email',
          error: emailError.message,
          timestamp: new Date(),
          template
        });

        return { 
          email: recipient.email, 
          success: false, 
          error: emailError.message,
          type: 'custom'
        };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successfulEmails = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(r => r.value);
    
    const failedEmails = results
      .filter(r => r.status === 'fulfilled' && !r.value.success)
      .map(r => r.value);

    // Log batch summary
    await db.collection('EmailBatches').add({
      hotelId,
      propertyName,
      subject,
      template,
      totalRecipients: allRecipients.length,
      guestRecipients: recipients?.length || 0,
      customRecipients: customEmailAddresses?.length || 0,
      successfulCount: successfulEmails.length,
      failedCount: failedEmails.length,
      sentAt: new Date(),
      sentBy: request.auth ? request.auth.uid : 'system'
    });

    return {
      success: true,
      total: allRecipients.length,
      successful: successfulEmails.length,
      failed: failedEmails.length,
      messageId: successfulEmails[0]?.messageId || null
    };

  } catch (error) {
    console.error('Error sending bulk email:', error);
    
    await db.collection('EmailErrors').add({
      hotelId,
      type: 'custom_bulk_email_batch',
      error: error.message,
      timestamp: new Date(),
      template
    });
    
    throw new Error(`Failed to send bulk email: ${error.message}`);
  }
});

// ====================
// TEST EMAIL FUNCTION
// ====================
export const sendTestEmail = onCall(async (request) => {
  const { to, subject, body, template } = request.data;

  if (!to) {
    throw new Error('Missing recipient email');
  }

  try {
    const testBody = body
      .replace(/{{GuestName}}/g, 'Test Guest')
      .replace(/{{PropertyName}}/g, 'Test Property')
      .replace(/{{PropertyWhatsApp}}/g, '+1234567890')
      .replace(/{{AffectedArea}}/g, 'Test Area')
      .replace(/{{DateTime}}/g, new Date().toLocaleString())
      .replace(/{{ItemDescription}}/g, 'Test Item')
      .replace(/{{CheckOutTime}}/g, '12:00 PM')
      .replace(/{{QuietHours}}/g, '10:00 PM - 7:00 AM')
      .replace(/{{SmokingPolicy}}/g, 'Non-smoking property')
      .replace(/{{VisitorPolicy}}/g, 'Visitors must register at reception');

    const response = await postmarkClient.sendEmail({
      From: 'checkin@bookello.life',
      To: to,
      Subject: subject,
      HtmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
            .test-banner { background: #fbbf24; color: #92400e; padding: 10px; text-align: center; border-radius: 5px; margin-bottom: 20px; font-weight: bold; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 25px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0; }
            .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="test-banner">TEST EMAIL - This is a preview only</div>
          <div class="header">
            <h2 style="margin: 0; font-size: 20px;">Test Property</h2>
            <p style="margin: 5px 0 0; opacity: 0.9;">${template ? template.replace('_', ' ').toUpperCase() : 'CUSTOM EMAIL'}</p>
          </div>
          <div class="content">
            ${testBody.replace(/\n/g, '<br>')}
            <div class="footer">
              <p>This is a test email sent from Bookello Admin Panel</p>
            </div>
          </div>
        </body>
        </html>
      `,
      TextBody: `TEST EMAIL - This is a preview only\n\n${testBody}\n\nThis is a test email sent from Bookello Admin Panel`,
      MessageStream: 'outbound',
      Tag: 'test-email'
    });

    return {
      success: true,
      messageId: response.MessageID,
      message: 'Test email sent successfully'
    };

  } catch (error) {
    console.error('Error sending test email:', error);
    throw new Error(`Failed to send test email: ${error.message}`);
  }
});


// ====================
// RESEND EMAIL FUNCTION
// ====================

export const resendEmail = onCall(async (request) => {
  const { emailId } = request.data;

  if (!emailId) {
    throw new Error('Missing email ID');
  }

  try {
    const emailDoc = await db.collection('EmailHistory').doc(emailId).get();
    
    if (!emailDoc.exists) {
      throw new Error('Email not found');
    }

    const emailData = emailDoc.data();
    
    // Get the original recipients from logs
    const logsQuery = await db.collection('EmailLogs')
      .where('emailHistoryId', '==', emailId)
      .get();
    
    const recipients = logsQuery.docs.map(doc => ({
      email: doc.data().recipientEmail,
      name: doc.data().recipientName,
      checkinId: doc.data().checkinId
    }));

    // Resend using the custom bulk email function
    const hotelDoc = await db.collection('Hotels').doc(emailData.hotelId).get();
    const hotelData = hotelDoc.data();

    const resendResult = await sendCustomBulkEmail({
      auth: request.auth,
      data: {
        hotelId: emailData.hotelId,
        propertyName: hotelData.name,
        propertyWhatsApp: hotelData.whatsappNumber || '',
        recipients,
        subject: emailData.subject,
        body: emailData.body,
        template: emailData.template || 'custom'
      }
    });

    // Update original email history
    await emailDoc.ref.update({
      resentAt: new Date(),
      resentBy: request.auth.uid,
      resentMessageId: resendResult.data.messageId,
      originalMessageId: emailData.messageId
    });

    return {
      success: true,
      message: 'Email resent successfully',
      resentCount: recipients.length
    };

  } catch (error) {
    console.error('Error resending email:', error);
    throw new Error(`Failed to resend email: ${error.message}`);
  }
});


const sendEmailDirectly = async (data) => {
  try {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Postmark-Server-Token': '417936d6-f508-4fcf-8060-faaf1654941f'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Postmark API error:', error)
    throw error
  }
}




