import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/s3Config';

export const uploadManyToS3 = async (files: Express.Multer.File[], path: string) => {
  return Promise.all(
    files.map(async (file) => {
      const key = `${path}/${Date.now()}-${file.originalname}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return { Key: key };
    }),
  );
};
