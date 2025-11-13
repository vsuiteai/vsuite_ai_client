const generate_onboarding_mail = (
  client_contact_username: string,
  ceo_onboarding_link: string,
  advisior_onboarding_link: string,
  asset_upload_link: string
) => {
  return `
<!DOCTYPE html>
<html>
    <head>
    <meta charset="UTF-8" />
    <title>Additional Files Required</title>
    <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 30px;
        color: #333;
        }
        .container {
        background-color: #fff;
        padding: 25px;
        max-width: 600px;
        margin: 0 auto;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
        .footer {
        font-size: 12px;
        color: #888;
        margin-top: 30px;
        text-align: center;
        }
    </style>
    </head>
    <body>
    <div class="container">
       
        <h2>Client Onboarding</h2>
        <p>Hey ${client_contact_username},</p>
        <p>Your StartupBrain account is verified. Click the link below to begin your onboarding process. Our process has three steps.</p>
        
        <ol>
        <li><a href="${advisior_onboarding_link}">Complete Company Questionnaire.</a></li>
        <li><a href="${ceo_onboarding_link}">Complete CEO Questionnaire.</a></li>
        <li><a href="${asset_upload_link}">Upload basic financial documents (at least prior year and YTD).</a> (No human sees your financial data.)</li>
        </ol>
        <p>Please note: The intentionality and accuracy of the information you provide is essential to the process and the intelligence you get from Startup Brain. Answer every question honestly and candidly. When your data is uploaded to the system, it becomes anonymous to our algorithms and only used to generate detailed instructions to help you grow your business.</p>

        <p><bold>
          *AI can generate incorrect answers. The results in Startup Brain are not considered legal or financial advice.
        </bold></p>


        <p>Best regards,<br />Benjamin Strategy Group</p>

        <div class="footer">
        This is an automated message. Please do not reply directly to this email.
        </div>
    </div>
    </body>
</html>
    `;
};

export { generate_onboarding_mail };
