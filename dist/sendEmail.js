"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config(); // If using .env file
const transporter = nodemailer_1.default.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587, // Use 465 for SSL
    secure: false, // True for 465, false for 587
    auth: {
        user: process.env.BREVO_USER, // Your Brevo email
        pass: process.env.BREVO_PASS, // Your SMTP key
    },
});
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ refereeName, refereeEmail, courseInterested }) {
        console.log(refereeEmail);
        try {
            let info = yield transporter.sendMail({
                from: '"Your Name" <ggcallahaan@gmail.com>', // Verified sender
                to: refereeEmail,
                subject: `Received a referral  for course -${courseInterested}`,
                text: "This is a test email using Brevo SMTP",
                html: "<b>This is a test email using Brevo SMTP</b>",
            });
            console.log("Email sent:", info.messageId);
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    });
}
// sendEmail();
