import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'eu-north-1' });

export const sendAcceptanceEmail = async (toEmail: string, userName: string, postTitle: string) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: `Hello ${userName},\n\nCongratulations! You have been accepted for the post: "${postTitle}".\n\nBest regards,\nTeam`,
        },
      },
      Subject: {
        Data: 'You have been accepted!',
      },
    },
    Source: 'doso.platform@gmail.com',
  });

  try {
    await ses.send(command);
    console.log('Acceptance email sent.');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
