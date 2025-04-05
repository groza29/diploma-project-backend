import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from './s3Config';
import { Request } from 'express';

const bucketName = process.env.S3_BUCKET_NAME!;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request<{ id: string }>, file, cb) {
      const userId = req.params.id; // Get user ID from request
      cb(null, `avatars/${userId}.jpg`);
    },
  }),
});

export default upload;
