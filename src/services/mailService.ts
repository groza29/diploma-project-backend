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
          Data: `Hello ${userName},\n\nCongratulations! You have been accepted for the post: "${postTitle}".\n\nBest regards,\nTeam DoSo`,
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

export const sendUpdatePassowrd = async (toEmail: string, userName: string, id: string) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: `Hello ${userName},\n\ You forgot the password? You can change it on this link:\n http://localhost:3001/forgot-password/${id} \n\nBest regards,\nTeam DoSo`,
        },
      },
      Subject: {
        Data: 'Forgot password',
      },
    },
    Source: 'doso.platform@gmail.com',
  });

  try {
    await ses.send(command);
    console.log('Forgot password email sent.');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
