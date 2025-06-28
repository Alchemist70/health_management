const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug logs
  logger: true, // Enable logger
});

// Email templates
const emailTemplates = {
  appointmentBooked: (patientName, doctorName, date, time) => ({
    subject: "Appointment Confirmation - MedCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Appointment Confirmation</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been successfully booked with Dr. ${doctorName}.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Appointment Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>Date:</strong> ${date}</li>
            <li style="margin: 10px 0;"><strong>Time:</strong> ${time}</li>
            <li style="margin: 10px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</li>
          </ul>
        </div>
        <p><strong>Important Information:</strong></p>
        <ul>
          <li>Please arrive 15 minutes before your scheduled appointment time.</li>
          <li>If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</li>
          <li>Bring any relevant medical records or test results.</li>
        </ul>
        <p style="margin-top: 20px;">Best regards,<br>MedCare Team</p>
      </div>
    `,
  }),

  appointmentCancelled: (patientName, doctorName, date, time) => ({
    subject: "Appointment Cancellation - MedCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Appointment Cancellation</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment with Dr. ${doctorName} has been cancelled.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Cancelled Appointment Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>Date:</strong> ${date}</li>
            <li style="margin: 10px 0;"><strong>Time:</strong> ${time}</li>
            <li style="margin: 10px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</li>
          </ul>
        </div>
        <p>If you would like to book a new appointment, please visit our website.</p>
        <p style="margin-top: 20px;">Best regards,<br>MedCare Team</p>
      </div>
    `,
  }),

  appointmentApproved: (patientName, doctorName, date, time) => ({
    subject: "Appointment Approved - MedCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">Appointment Approved</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment request with Dr. ${doctorName} has been approved.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Appointment Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>Date:</strong> ${date}</li>
            <li style="margin: 10px 0;"><strong>Time:</strong> ${time}</li>
            <li style="margin: 10px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</li>
          </ul>
        </div>
        <p><strong>Important Information:</strong></p>
        <ul>
          <li>Please arrive 15 minutes before your scheduled appointment time.</li>
          <li>If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</li>
          <li>Bring any relevant medical records or test results.</li>
        </ul>
        <p style="margin-top: 20px;">Best regards,<br>MedCare Team</p>
      </div>
    `,
  }),

  appointmentRejected: (patientName, doctorName, date, time) => ({
    subject: "Appointment Request Rejected - MedCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Appointment Request Rejected</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment request with Dr. ${doctorName} has been rejected.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Rejected Appointment Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>Date:</strong> ${date}</li>
            <li style="margin: 10px 0;"><strong>Time:</strong> ${time}</li>
            <li style="margin: 10px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</li>
          </ul>
        </div>
        <p>If you would like to book a new appointment, please visit our website.</p>
        <p style="margin-top: 20px;">Best regards,<br>MedCare Team</p>
      </div>
    `,
  }),

  prescriptionAdded: (patientName, doctorName, date) => ({
    subject: "New Prescription Added - MedCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">New Prescription Added</h2>
        <p>Dear ${patientName},</p>
        <p>Dr. ${doctorName} has added a new prescription to your medical record for your appointment on ${date}.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Important Information:</strong></p>
          <ul>
            <li>You can view your prescription details by logging into your MedCare account.</li>
            <li>Please follow the prescribed medication schedule carefully.</li>
            <li>If you have any questions about your prescription, contact your doctor.</li>
          </ul>
        </div>
        <p style="margin-top: 20px;">Best regards,<br>MedCare Team</p>
      </div>
    `,
  }),
};

const sendEmail = async (to, template, data) => {
  try {
    console.log("Attempting to send email:", {
      to,
      template,
      data,
      from: process.env.EMAIL_USER,
    });

    const { subject, html } = emailTemplates[template](...data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    return false;
  }
};

module.exports = {
  sendEmail,
  emailTemplates,
};
