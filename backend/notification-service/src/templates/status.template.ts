export const statusChangedTemplate = (data: {
  candidateName: string;
  jobTitle: string;
  status: string;
}) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>Application Status Updated</h2>
    <p>Hi ${data.candidateName},</p>
    <p>The status of your application for <strong>${data.jobTitle}</strong> has been updated to: <strong>${data.status}</strong>.</p>
    <p>Please log in to your dashboard for more details.</p>
    <p>Best regards,<br/>The CareerStack Team</p>
  </div>
`;
