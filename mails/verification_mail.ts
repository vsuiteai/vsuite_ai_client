const generate_verification_mail = (
  client_contact_username: string,
  verification_link: string,
  token_expires_at_hours: number
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
        <h2> Initial Email - Hello ${client_contact_username}.</h2>

        <p>
          Welcome to the beta version of Startup Brain a product of vSuite, founded by Marcus Benjamin and Charlie Williams. Marcus is the CEO of Benjamin Strategy Advisors, global strategy company. He's worked with venture backed startups and large corporations up to $1B in revenue. Charlie is a former Wall Street executive and retired Senior Executive at Bank of America. He was a member of very small team that raised $501M to buy failed banks.
        </p>

        <p>
          Startup Brain exists to help businesses under $1M in revenue with the perspective and strategies to cross the $1M mark. With this beta release, you get the initial version of the platform that will be launched to the public December 1st.
        </p>

        <p>Please click the verification link below to confirm your account.</p>
    
        <p><a href="${verification_link}">verification link</a></p>
        <p>Please note that this link would expire in ${token_expires_at_hours} hour(s). Thank you for your attention.</p>
        <p>Best regards,<br />Benjamin Strategy Group</p>

        <div class="footer">
        This is an automated message. Please do not reply directly to this email.
        </div>
    </div>
    </body>
</html>
    `;
};

export { generate_verification_mail };
