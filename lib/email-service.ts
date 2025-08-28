import sgMail from "@sendgrid/mail"

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface PaymentConfirmationData {
  userEmail: string
  userName: string
  planName: string
  amount: string
  billingCycle: string
  nextBillingDate: string
}

interface SubscriptionUpdateData {
  userEmail: string
  userName: string
  planName: string
  action: "upgraded" | "downgraded" | "cancelled"
  effectiveDate: string
}

export class EmailService {
  private static fromEmail = process.env.SENDGRID_FROM_EMAIL || "[EXAMPLE_EMAIL_noreply@yourdomain.com]"
  private static fromName = process.env.SENDGRID_FROM_NAME || "PromptForge"

  static async sendPaymentConfirmation(data: PaymentConfirmationData): Promise<boolean> {
    try {
      const template = this.getPaymentConfirmationTemplate(data)
      
      const msg = {
        to: data.userEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
      }

      await sgMail.send(msg)
      
      // Log email sent
      await this.logEmailNotification(data.userEmail, "payment_confirmation", "sent")
      
      return true
    } catch (error) {
      console.error("Failed to send payment confirmation email:", error)
      
      // Log email failure
      await this.logEmailNotification(data.userEmail, "payment_confirmation", "failed", error instanceof Error ? error.message : "Unknown error")
      
      return false
    }
  }

  static async sendSubscriptionUpdate(data: SubscriptionUpdateData): Promise<boolean> {
    try {
      const template = this.getSubscriptionUpdateTemplate(data)
      
      const msg = {
        to: data.userEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
      }

      await sgMail.send(msg)
      
      // Log email sent
      await this.logEmailNotification(data.userEmail, "subscription_update", "sent")
      
      return true
    } catch (error) {
      console.error("Failed to send subscription update email:", error)
      
      // Log email failure
      await this.logEmailNotification(data.userEmail, "subscription_update", "failed", error instanceof Error ? error.message : "Unknown error")
      
      return false
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName: string, planName: string): Promise<boolean> {
    try {
      const template = this.getWelcomeEmailTemplate(userName, planName)
      
      const msg = {
        to: userEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
      }

      await sgMail.send(msg)
      
      // Log email sent
      await this.logEmailNotification(userEmail, "welcome", "sent")
      
      return true
    } catch (error) {
      console.error("Failed to send welcome email:", error)
      
      // Log email failure
      await this.logEmailNotification(userEmail, "welcome", "failed", error instanceof Error ? error.message : "Unknown error")
      
      return false
    }
  }

  private static getPaymentConfirmationTemplate(data: PaymentConfirmationData): EmailTemplate {
    const subject = `Payment Confirmation - ${data.planName} Plan`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d1a954, #b8941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .plan-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d1a954; }
            .amount { font-size: 24px; font-weight: bold; color: #d1a954; }
            .button { display: inline-block; background: #d1a954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Payment Confirmed!</h1>
              <p>Thank you for choosing PromptForge</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.userName},</h2>
              <p>Your payment has been successfully processed. Here are the details:</p>
              
              <div class="plan-details">
                <h3>${data.planName} Plan</h3>
                <p><strong>Amount:</strong> <span class="amount">${data.amount}</span></p>
                <p><strong>Billing Cycle:</strong> ${data.billingCycle}</p>
                <p><strong>Next Billing Date:</strong> ${data.nextBillingDate}</p>
              </div>
              
              <p>You now have access to all the features included in your plan. Start exploring PromptForge to unlock your AI potential!</p>
              
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Go to Dashboard</a>
              
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br>The PromptForge Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 PromptForge. All rights reserved.</p>
              <p>This email was sent to ${data.userEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const text = `
Payment Confirmation - ${data.planName} Plan

Hello ${data.userName},

Your payment has been successfully processed. Here are the details:

${data.planName} Plan
Amount: ${data.amount}
Billing Cycle: ${data.billingCycle}
Next Billing Date: ${data.nextBillingDate}

You now have access to all the features included in your plan. Start exploring PromptForge to unlock your AI potential!

Go to Dashboard: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The PromptForge Team

© 2024 PromptForge. All rights reserved.
This email was sent to ${data.userEmail}
    `

    return { subject, html, text }
  }

  private static getSubscriptionUpdateTemplate(data: SubscriptionUpdateData): EmailTemplate {
    const actionText = {
      upgraded: "upgraded",
      downgraded: "downgraded", 
      cancelled: "cancelled"
    }[data.action]
    
    const subject = `Subscription ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} - ${data.planName} Plan`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d1a954, #b8941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .update-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d1a954; }
            .button { display: inline-block; background: #d1a954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Subscription Update</h1>
              <p>Your plan has been ${actionText}</p>
            </div>
            
            <div class="content">
              <h2>Hello ${data.userName},</h2>
              <p>Your subscription has been successfully ${actionText}. Here are the details:</p>
              
              <div class="update-details">
                <h3>${data.planName} Plan</h3>
                <p><strong>Action:</strong> ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}</p>
                <p><strong>Effective Date:</strong> ${data.effectiveDate}</p>
              </div>
              
              <p>${this.getActionMessage(data.action)}</p>
              
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Go to Dashboard</a>
              
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br>The PromptForge Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 PromptForge. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const text = `
Subscription ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} - ${data.planName} Plan

Hello ${data.userName},

Your subscription has been successfully ${actionText}. Here are the details:

${data.planName} Plan
Action: ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}
Effective Date: ${data.effectiveDate}

${this.getActionMessage(data.action)}

Go to Dashboard: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The PromptForge Team

© 2024 PromptForge. All rights reserved.
    `

    return { subject, html, text }
  }

  private static getWelcomeEmailTemplate(userName: string, planName: string): EmailTemplate {
    const subject = `Welcome to PromptForge - ${planName} Plan`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PromptForge</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d1a954, #b8941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d1a954; }
            .button { display: inline-block; background: #d1a954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to PromptForge!</h1>
              <p>Your AI journey starts now</p>
            </div>
            
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Welcome to PromptForge! We're excited to have you on board with the ${planName} plan.</p>
              
              <div class="features">
                <h3>What's Next?</h3>
                <ul>
                  <li>Explore our comprehensive module library</li>
                  <li>Create and test your first prompts</li>
                  <li>Export your work in multiple formats</li>
                  <li>Join our community of AI enthusiasts</li>
                </ul>
              </div>
              
              <p>Ready to get started? Head over to your dashboard and begin creating amazing AI prompts!</p>
              
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Get Started</a>
              
              <p>If you need help getting started, check out our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/docs">documentation</a> or contact our support team.</p>
              
              <p>Best regards,<br>The PromptForge Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 PromptForge. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const text = `
Welcome to PromptForge - ${planName} Plan

Hello ${userName},

Welcome to PromptForge! We're excited to have you on board with the ${planName} plan.

What's Next?
- Explore our comprehensive module library
- Create and test your first prompts
- Export your work in multiple formats
- Join our community of AI enthusiasts

Ready to get started? Head over to your dashboard and begin creating amazing AI prompts!

Get Started: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard

If you need help getting started, check out our documentation or contact our support team.

Best regards,
The PromptForge Team

© 2024 PromptForge. All rights reserved.
    `

    return { subject, html, text }
  }

  private static getActionMessage(action: string): string {
    switch (action) {
      case "upgraded":
        return "You now have access to additional features and higher usage limits. Enjoy exploring the new capabilities!"
      case "downgraded":
        return "Your plan has been adjusted. Some features may no longer be available, but your data is safe."
      case "cancelled":
        return "Your subscription will remain active until the end of the current billing period. You can reactivate anytime from your dashboard."
      default:
        return "Your subscription has been updated successfully."
    }
  }

  private static async logEmailNotification(
    userEmail: string, 
    emailType: string, 
    status: string, 
    errorMessage?: string
  ): Promise<void> {
    try {
      // This would typically log to the database
      // For now, we'll just console.log
      console.log("Email notification logged:", {
        userEmail,
        emailType,
        status,
        errorMessage,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to log email notification:", error)
    }
  }
}
