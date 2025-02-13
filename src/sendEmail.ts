import nodemailer from "nodemailer"
require("dotenv").config(); // If using .env file

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587, // Use 465 for SSL
  secure: false, // True for 465, false for 587
  auth: {
    user:process.env.BREVO_USER, // Your Brevo email
    pass:process.env.BREVO_PASS, // Your SMTP key
  },
});

export async function sendEmail({refereeName,refereeEmail,courseInterested}:{refereeName:string,refereeEmail:string,courseInterested:string}) {
  console.log(refereeEmail)
  try {
    let info = await transporter.sendMail({
      from: '"Your Name" <ggcallahaan@gmail.com>', // Verified sender
      to: refereeEmail,
      subject: `Received a referral  for course -${courseInterested}`,
      text: "This is a test email using Brevo SMTP",
      html: "<b>This is a test email using Brevo SMTP</b>",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// sendEmail();
