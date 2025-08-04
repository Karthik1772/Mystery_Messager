function generateVerificationEmailHTML(username: string, verifyCode: string) {
  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', Verdana, sans-serif;
            font-weight: 400;
            font-style: normal;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333333;
            margin-bottom: 20px;
            font-size: 24px;
          }
          p {
            color: #666666;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .otp-code {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #2c3e50;
            letter-spacing: 8px;
            margin: 30px 0;
            font-family: 'Courier New', monospace;
          }
          .verify-button {
            display: inline-block;
            background-color: #61dafb;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .verify-button:hover {
            background-color: #4fa8c5;
          }
          .disclaimer {
            color: #999999;
            font-size: 14px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h2>Hello ${username},</h2>
          
          <p>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </p>
          
          <div class="otp-code">
            ${verifyCode}
          </div>
          
          <p class="disclaimer">
            If you did not request this code, please ignore this email.
          </p>
          
          <!-- Uncomment if you want to include the verification button -->
          <!--
          <a href="http://localhost:3000/verify/${username}" class="verify-button">
            Verify here
          </a>
          -->
        </div>
      </body>
    </html>
  `;
}

export default generateVerificationEmailHTML;