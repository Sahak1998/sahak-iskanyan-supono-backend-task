import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { saveToStorage } from '../services/firebase/uploadToFirebase';
import { DEEPART_API_KEY, DEEPART_API_URL, GIGAPIXEL_API_KEY, GIGAPIXEL_API_URL } from '../services/utils/constants';

export const upscale = async (req: Request, res: Response): Promise<any> => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }

    try {
        const imageBuffer = fs.readFileSync(file.path);

        const response = await axios.post(
            GIGAPIXEL_API_URL,
            imageBuffer,
            {
                params: {
                    scale: req.body.scale || '2x',
                },
                headers: {
                    'Api-Key': GIGAPIXEL_API_KEY,
                    'Content-Type': 'application/octet-stream',
                },
                responseType: 'arraybuffer',
            }
        );

        const upscaledImageBuffer = Buffer.from(response.data, 'binary');

        const filename = `upscaled/${Date.now()}_${file.originalname}`;

        const firebaseImageUrl = await saveToStorage(imageBuffer, filename);

        fs.unlinkSync(file.path);

        return res.status(200).json({ firebaseImageUrl });

    } catch (error: any) {
        console.error('Error during image upscaling:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Error upscaling image.', error: error.response?.data || error.message });
    }
};

export const style = async (req: Request, res: Response): Promise<any> => {
    const { style } = req.body;
    const file = req.file;

    if (!style || !file) {
        return res.status(400).json({ message: 'Style and image file are required.' });
    }

    try {
        const imagePath = path.join(__dirname, '../../', file.path);
        const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

        const response = await axios.post(
            DEEPART_API_URL,
            {
                image: `data:image/jpeg;base64,${imageData}`,
                style: style
            },
            {
                headers: {
                    'Api-Key': DEEPART_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const stylizedImageUrl = response.data.output_url;
        const stylizedResponse = await axios.get(stylizedImageUrl, { responseType: 'arraybuffer' });
        const stylizedImageBuffer = Buffer.from(stylizedResponse.data, 'binary');

        const filename = `stylized/${Date.now()}_${file.originalname}`;

        const firebaseStylizedImageUrl = await saveToStorage(stylizedImageBuffer, filename);

        fs.unlinkSync(imagePath);

        return res.status(200).json({ firebaseImageUrl: firebaseStylizedImageUrl });
    } catch (error: any) {
        console.error('Error with DeepArt.io:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error applying style with DeepArt.io.', error: error.response?.data || error.message });
    }
};