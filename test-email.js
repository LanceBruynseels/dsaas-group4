const nodemailer = require("nodemailer");

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: "SaasGroupVlinder@gmail.com", // Replace with your email
        pass: "zdcrbohyakqtiwli", // Replace with your Gmail app password
    },
});

// Define email details
const mailOptions = {
    from: "SaasGroupVlinder@gmail.com", // Replace with your email
    to: "manuel.pollet@gmail.com", // Replace with the recipient's email
    subject: "Test Email",
    text: "This is a test email sent using Nodemailer.",
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
    } else {
        console.log("Email sent successfully:", info.response);
    }
});
