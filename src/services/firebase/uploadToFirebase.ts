import { Buffer } from 'buffer';
import { adminStorage } from '../../firebase/adminConfig';

export const saveToStorage = async (buffer: Buffer, fileName: string): Promise<string> => {
  try {
    const uniqueFileName = `${crypto.randomUUID()}_${fileName}`;

    const file = adminStorage.file(uniqueFileName);

    const uploadOptions = {
      metadata: {
        contentType: 'application/octet-stream',
      },
      resumable: false,
    };

    await file.save(buffer, uploadOptions);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return signedUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};