import nodemailer from "nodemailer"

export const sendEmail = async (email, subject, message) =>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS
        }
    })

    await transporter.sendMail({
        from: `"College System" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: subject,
        html: message
    })
}

