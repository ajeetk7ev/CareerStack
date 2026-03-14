export const applicationSubmittedTemplate = (data: {
  candidateName: string;
  jobTitle: string;
  companyName: string;
}) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>Application Submitted!</h2>
    <p>Hi ${data.candidateName},</p>
    <p>You have successfully applied for the position of <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong>.</p>
    <p>The recruiter will review your application soon. You will be notified of any status changes.</p>
    <p>Best regards,<br/>The CareerStack Team</p>
  </div>
`;

export const recruiterNewApplicationTemplate = (data: {
  recruiterName: string;
  candidateName: string;
  jobTitle: string;
}) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>New Application Received</h2>
    <p>Hi ${data.recruiterName},</p>
    <p>You have received a new application from <strong>${data.candidateName}</strong> for the position of <strong>${data.jobTitle}</strong>.</p>
    <p>Please log in to your dashboard to review the application.</p>
    <p>Best regards,<br/>The CareerStack Team</p>
  </div>
`;
