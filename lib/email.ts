import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: 'Welcome to PromptForge! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d1a954, #b8941f); padding: 20px; text-align: center;">
          <h1 style="color: #000; margin: 0;">Welcome to PromptForge!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hi {{name}}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Welcome to PromptForge, your AI-powered prompt engineering platform! 
            We're excited to have you on board.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d1a954; margin-top: 0;">What's next?</h3>
            <ul style="color: #666;">
              <li>Explore our 50+ prompt modules</li>
              <li>Try the AI-powered generation features</li>
              <li>Export your prompts in multiple formats</li>
              <li>Join our community for tips and tricks</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: #d1a954; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Get Started
            </a>
          </div>
        </div>
        <div style="background: #333; color: #fff; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 PromptForge. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Welcome to PromptForge!
      
      Hi {{name}}!
      
      Welcome to PromptForge, your AI-powered prompt engineering platform! 
      We're excited to have you on board.
      
      What's next?
      - Explore our 50+ prompt modules
      - Try the AI-powered generation features
      - Export your prompts in multiple formats
      - Join our community for tips and tricks
      
      Get started: {{dashboardUrl}}
      
      © 2024 PromptForge. All rights reserved.
    `
  },
  
  SUBSCRIPTION_CONFIRMED: {
    subject: 'Subscription Confirmed - PromptForge Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d1a954, #b8941f); padding: 20px; text-align: center;">
          <h1 style="color: #000; margin: 0;">Subscription Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hi {{name}}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Your {{planName}} subscription has been successfully activated! 
            You now have access to all premium features.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d1a954; margin-top: 0;">Your Plan Includes:</h3>
            <ul style="color: #666;">
              {{#each features}}
              <li>{{this}}</li>
              {{/each}}
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background: #d1a954; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Access Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
    text: `
      Subscription Confirmed!
      
      Hi {{name}}!
      
      Your {{planName}} subscription has been successfully activated! 
      You now have access to all premium features.
      
      Your Plan Includes:
      {{#each features}}
      - {{this}}
      {{/each}}
      
      Access Dashboard: {{dashboardUrl}}
    `
  },
  
  MODULE_SHARED: {
    subject: 'Module Shared with You - PromptForge',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d1a954, #b8941f); padding: 20px; text-align: center;">
          <h1 style="color: #000; margin: 0;">Module Shared!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hi {{name}}!</h2>
          <p style="color: #666; line-height: 1.6;">
            {{senderName}} has shared a prompt module with you: <strong>{{moduleName}}</strong>
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d1a954; margin-top: 0;">Module Details:</h3>
            <p style="color: #666;"><strong>Description:</strong> {{moduleDescription}}</p>
            <p style="color: #666;"><strong>Category:</strong> {{moduleCategory}}</p>
            <p style="color: #666;"><strong>Difficulty:</strong> {{moduleDifficulty}}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{moduleUrl}}" style="background: #d1a954; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Module
            </a>
          </div>
        </div>
      </div>
    `,
    text: `
      Module Shared!
      
      Hi {{name}}!
      
      {{senderName}} has shared a prompt module with you: {{moduleName}}
      
      Module Details:
      Description: {{moduleDescription}}
      Category: {{moduleCategory}}
      Difficulty: {{moduleDifficulty}}
      
      View Module: {{moduleUrl}}
    `
  }
} as const

export async function sendEmail(
  to: string,
  template: keyof typeof EMAIL_TEMPLATES,
  variables: Record<string, any>
): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured, skipping email send')
      return true // Return true in demo mode
    }

    const emailTemplate = EMAIL_TEMPLATES[template]
    
    // Simple template variable replacement
    let html = emailTemplate.html
    let text = emailTemplate.text
    let subject = emailTemplate.subject
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      html = html.replace(new RegExp(placeholder, 'g'), value)
      text = text.replace(new RegExp(placeholder, 'g'), value)
      subject = subject.replace(new RegExp(placeholder, 'g'), value)
    })

    await transporter.sendMail({
      from: `"PromptForge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  return sendEmail(userEmail, 'WELCOME', {
    name: userName,
    dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })
}

export async function sendSubscriptionEmail(
  userEmail: string, 
  userName: string, 
  planName: string, 
  features: string[]
) {
  return sendEmail(userEmail, 'SUBSCRIPTION_CONFIRMED', {
    name: userName,
    planName,
    features: features.join(', '),
    dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })
}

export async function sendModuleSharedEmail(
  userEmail: string,
  userName: string,
  senderName: string,
  moduleName: string,
  moduleDescription: string,
  moduleCategory: string,
  moduleDifficulty: string
) {
  return sendEmail(userEmail, 'MODULE_SHARED', {
    name: userName,
    senderName,
    moduleName,
    moduleDescription,
    moduleCategory,
    moduleDifficulty,
    moduleUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?module=${moduleName}`,
  })
}
