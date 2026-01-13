import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
      api_key: String(process.env.CLOUDINARY_API_KEY),
      api_secret: String(process.env.CLOUDINARY_API_SECRET),
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        filePath,
        { folder: 'car_rental_service_images' },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });
  }
}
