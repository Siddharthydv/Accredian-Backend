import { Router } from "express";
import prismaClient from "../prismaClient";
import bcrypt from "bcrypt"
import { AuthRequest } from "../authMiddleware";
import { sendEmail } from "../sendEmail";
export const referralRouter=Router();


referralRouter.get('/healthy',(req,res)=>{
    res.json("healthy").status(200)
})




referralRouter.get("/user/:id", async (req, res): Promise<void> => {
    try {
      const { id } = req.params;
  
      const user = await prismaClient.user.findUnique({
        where: { id: Number(id) }, // Convert id to number if it's stored as an integer
      });
  
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
referralRouter.get('/getReferrals',async (req:AuthRequest,res)=>{
  try{
    const userId=req.user.id;
    const referrals=await prismaClient.referral.findMany({
      where:{referrerId:userId}
    })
    res.json({success:true,referrals});
  }catch(error)
  {
    res.status(500).json({success:false,message:"Failed to fetch referrals"})
  }
})

referralRouter.get("/getDetails", async (req:AuthRequest, res) => {
    try {
      const userId=req.user.id;
      const users = await prismaClient.user.findMany({
        where:{id:userId},
        include: {
          referrals: true, // Include all referrals associated with each user
        },
      });
  
      res.json({ success: true, users });
    } catch (error) {
      console.error("Error fetching users with referrals:", error);
      res.status(500).json({ success: false, message: "Failed to fetch data." });
    }
  });



  referralRouter.post("/createReferral", async (req:AuthRequest, res): Promise<void> => {
    try {
      const {  refereeName, refereeEmail, courseInterested } = req.body;
      const referrerId=req.user.id || 1;
  
      // Validate required fields
      if (!referrerId || !refereeName || !refereeEmail || !courseInterested) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
      }
  
      // Ensure the referrer exists
      const referrer = await prismaClient.user.findUnique({ where: { id: referrerId } });
      if (!referrer) {
        res.status(404).json({ success: false, message: "Referrer not found" });
        return;
      }
  
     // Create referral entry in the database
      const referral = await prismaClient.referral.create({
        data: {
          referrerId,
          refereeName,
          refereeEmail,
          courseInterested,
        },
      });
      sendEmail({refereeName,refereeEmail,courseInterested});
      // Send an email notification to the referee
      // const mailOptions = {
      //   from: process.env.GMAIL_USER,
      //   to: refereeEmail,
      //   subject: "You've Been Referred!",
      //   text: `Hi ${refereeName},\n\n${referrer.name} has referred you for the ${courseInterested} course.\nSign up today to get started!\n\nBest,\nYour Team`,
      // };
  
      // await transporter.sendMail(mailOptions);
  
      res.status(201).json({ success: true, message: "Referral created successfully",referral });
    } catch (error) {
      console.error("Error creating referral:", error);
      res.status(500).json({ success: false, message: "Referral creation failed" });
    }
  });
  

  
export default referralRouter;


