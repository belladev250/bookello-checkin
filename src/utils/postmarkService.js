import { ServerClient } from 'postmark'

class PostmarkService {
  constructor() {
    // For Vue CLI, use process.env.VUE_APP_*
    const apiKey = process.env.VUE_APP_POSTMARK_API_KEY
    
    console.log('Postmark Configuration:', {
      apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'Not found',
      envType: 'Vue CLI',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('VUE_APP_'))
    })
    
    if (!apiKey) {
      console.warn('Postmark API key not found. Email functionality will be disabled.')
      this.client = null
      this.isEnabled = false
    } else {
      try {
        this.client = new ServerClient(apiKey)
        this.isEnabled = true
        console.log('✅ Postmark client initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Postmark client:', error)
        this.client = null
        this.isEnabled = false
      }
    }
  }


  async sendEmail(template, data) {
    if (!this.client) {
      console.warn('Postmark client not initialized. Email not sent:', template)
      return { success: false, message: 'Email service not configured' }
    }

    try {
      // Map your templates to Postmark templates or create inline emails
      const emailContent = this.generateEmailContent(template, data)
      
      const response = await this.client.sendEmail({
        From: 'checkin@bookello.life', 
        To: data.email,
        Subject: emailContent.subject,
        HtmlBody: emailContent.body,
        TextBody: emailContent.textBody || this.generateTextBody(emailContent.body),
        MessageStream: 'outbound'
      })

      console.log('Email sent successfully:', response)
      return { success: true, messageId: response.MessageID }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }
  }

  generateEmailContent(template, data) {
    switch (template) {
      case 'property_registration_pending':
        return {
          subject: `Property Registration Received – Under Review`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Property Registration — PENDING APPROVAL</h2>
              <p>Hello ${data.providerName},</p>
              <p>Thank you for registering your property <strong>${data.propertyName}</strong> on <strong>Bookello</strong>.</p>
              <p>Your application is currently under review by our verification team.</p>
              <h3>What happens next:</h3>
              <ul>
                <li>We review property details and documents</li>
                <li>Verification may take <strong>24–72 hours</strong></li>
                <li>You will receive an email once approved or declined</li>
              </ul>
              <p>No action is required from you at this time.</p>
              <p>Kind regards,<br>
              <strong>Bookello Onboarding Team</strong><br>
              <a href="https://marketplace.bookello.life">https://marketplace.bookello.life</a></p>
            </div>
          `
        }

      case 'property_approved':
        return {
          subject: `Your Property Has Been Approved on Bookello`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Property Approved</h2>
              <p>Hello ${data.providerName},</p>
              <p>Congratulations 🎉<br>
              Your property <strong>${data.propertyName}</strong> has been approved and is now active on Bookello.</p>
              <h3>You can now:</h3>
              <ul>
                <li>Accept bookings</li>
                <li>Use Check-In by Bookello</li>
                <li>Manage guests and invoices</li>
                <li>Increase visibility on the marketplace</li>
              </ul>
              <p><strong>Access your dashboard:</strong><br>
              <a href="${data.providerDashboardLink}">${data.providerDashboardLink}</a></p>
              <p>Welcome to the Bookello ecosystem.</p>
              <p>Best regards,<br>
              <strong>Bookello Team</strong> 🚀</p>
            </div>
          `
        }

      case 'invoice_sent':
        return {
          subject: `Invoice ${data.invoiceNumber} – Payment Required`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>INVOICE SENT TO PROPERTY</h2>
              <p>Hello ${data.providerName},</p>
              <p>An invoice has been generated for your property <strong>${data.propertyName}</strong> on <strong>Bookello</strong>.</p>
              <h3>Invoice Details</h3>
              <ul>
                <li><strong>Invoice Number:</strong> ${data.invoiceNumber}</li>
                <li><strong>Period:</strong> ${data.invoicePeriod}</li>
                <li><strong>Amount Due:</strong> ${data.invoiceAmount}</li>
                <li><strong>Due Date:</strong> ${data.dueDate}</li>
              </ul>
              <p>🔍 <strong>View & download invoice:</strong><br>
              <a href="${data.invoiceLink}">${data.invoiceLink}</a></p>
              <p>Once payment is completed, please upload your payment receipt in your dashboard for confirmation.</p>
              <p>If you have any questions, we're ready to assist.</p>
            </div>
          `
        }

      case 'payment_receipt_uploaded':
        return {
          subject: `Payment Receipt Received – Invoice ${data.invoiceNumber}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>PAYMENT RECEIPT UPLOADED</h2>
              <p>Hello ${data.providerName},</p>
              <p>We have successfully received your payment receipt for:</p>
              <ul>
                <li><strong>Invoice Number:</strong> ${data.invoiceNumber}</li>
                <li><strong>Property:</strong> ${data.propertyName}</li>
                <li><strong>Amount Paid:</strong> ${data.amountPaid}</li>
              </ul>
              <p>Our finance team will review and confirm your payment shortly.</p>
              <p>🔍 <strong>View invoice status:</strong><br>
              <a href="${data.invoiceStatusLink}">${data.invoiceStatusLink}</a></p>
              <p>Thank you for your cooperation.</p>
              <p>Best regards,<br>
              <strong>Bookello Finance Team</strong></p>
            </div>
          `
        }

      case 'payment_confirmed':
        return {
          subject: `Payment Confirmed – Invoice ${data.invoiceNumber}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>PAYMENT CONFIRMED</h2>
              <p>Hello ${data.providerName},</p>
              <p>Your payment for <strong>Invoice ${data.invoiceNumber}</strong> has been confirmed successfully.</p>
              <h3>Payment Summary</h3>
              <ul>
                <li><strong>Property:</strong> ${data.propertyName}</li>
                <li><strong>Amount Paid:</strong> ${data.amountPaid}</li>
                <li><strong>Confirmation Date:</strong> ${data.confirmationDate}</li>
              </ul>
              <p>Your account remains active with no outstanding balance.</p>
              <p>🔍 <strong>View invoice record:</strong><br>
              <a href="${data.invoiceLink}">${data.invoiceLink}</a></p>
              <p>Thank you for partnering with <strong>Bookello</strong>.</p>
              <p>Warm regards,<br>
              <strong>Bookello Finance Team</strong></p>
            </div>
          `
        }

      case 'guest_checkin_confirmation':
        return {
          subject: `Check-In Completed – ${data.propertyName}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>GUEST CHECK-IN CONFIRMATION</h2>
              <p>Hello ${data.guestName},</p>
              <p>Your check-in at <strong>${data.propertyName}</strong> has been completed successfully.</p>
              <h3>Stay Details</h3>
              <ul>
                <li><strong>Property:</strong> ${data.propertyName}</li>
                <li><strong>Check-in Date:</strong> ${data.checkinDate}</li>
                <li><strong>Room / Unit:</strong> ${data.roomNumber}</li>
              </ul>
              <p>If you need assistance during your stay, please contact the property reception.</p>
              <p>We wish you a pleasant stay in Rwanda 🇷🇼</p>
              <p>Warm regards,<br>
              <strong>Check-In by Bookello</strong></p>
            </div>
          `
        }

      default:
        throw new Error(`Email template "${template}" not found`)
    }
  }

  generateTextBody(htmlBody) {
    // Simple HTML to text conversion
    return htmlBody
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }
}

export const postmarkService = new PostmarkService()