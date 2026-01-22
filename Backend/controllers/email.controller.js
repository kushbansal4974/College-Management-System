import { sendEmail } from "../utils/sendEmail.js";
import { generateOtp } from "../utils/generateOtp.js";
import { otpStore } from "../utils/otpStore.js";
import { verifiedEmails } from "../models/email.model.js";

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    if(!email.endsWith("@huroorkee.ac.in")){
        return res.status(400).json({
            message: "Only college email is allowed",
            success: false
        })
    }

    const verified = await verifiedEmails.findOne({email})
    if(verified){
      return res.status(400).json({
        message: "Email already verified",
        success: false
      })
    }

    const otp = generateOtp()

    otpStore[email] = {
        otp: otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    }

    await sendEmail(
      email,
      "Email Verification OTP",
      `<p>
      To Verify your email in My College <br/>
      Your OTP is: <b>${otp}</b> <br/>
      
      <span> The OTP will be expires in <b>5 minutes</b>. </span>
      </p>`
    );

    return res.status(200).json({
        message: "Otp sent successfully!",
        success: true
    })

  } catch (e) {
    console.log("Error in verifyEmail: ",e)
    return res.status(500).json({
        message: "Internal Server Error",
        success: false
    })
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const {email, otp} = req.body

    if(!email || !otp){
      return res.status(400).json({
        message: "Something is missing",
        success: false
      })
    }

    const record = otpStore[email]

    if(!record){
      return res.status(400).json({
        message: "Otp expried or invalid email",
        success: false
      })
    }


    if(Date.now() > record.expiresAt){
      delete otpStore[email]
      return res.status(400).json({
        message: "Otp expired",
        success: false
      })
    }

    if(record.otp !== otp){
      return res.status(400).json({
        message: "Wrong Otp",
        success: false
      })
    }

    await verifiedEmails.create({
      email,
      verifiedAt: new Date
    })

    delete otpStore[email]

    return res.status(200).json({
        message: "OTP Verified Successfully",
        success: true,
      });

  } catch (e) {
    console.log("Error in verifyOtp: ", e)
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    })
  }
}