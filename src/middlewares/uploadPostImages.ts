import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/s3Config';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const bucketName = process.env.S3_BUCKET_NAME!;

const uploadPostImages = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request<{ postId: string }>, file, cb) {
      const postId = req.params.postId;
      const uniqueFileName = `${postId}/${uuidv4()}-${file.originalname}`;
      cb(null, `posts/${uniqueFileName}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export default uploadPostImages;
