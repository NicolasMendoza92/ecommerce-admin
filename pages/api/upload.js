// usamos multipary para traer archivos de nuestro request -
// cuando le damos a upload, ya se carga nuestro file y dentro de el tiene propiedades 
import { mongooseConnect } from "@/lib/mongoose";
import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { isAdminRequest} from "@/pages/api/auth/[...nextauth]";
const bucketName = 'nmendoza-nextjs-ecommerce';

export default async function handle(req, res) {
    
    await mongooseConnect();
    await isAdminRequest(req,res);
    const {method} = req

    if(method === 'POST') {
        const form = new multiparty.Form();
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });
    
        const client = new S3Client({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
        });
        // creo el array vacio para agregar los links nuevos
        const links = []
        // codigo para crear un loop de todos los archivos. Dentro de file yo tengo un objeto con props, one of them is called "originalFilename" y de eso tenemos que obtener la extension. JPG, PNG, etc . ebtonces hacemos esta formula: 
    
        for (const file of files.file) {
            const ext = file.originalFilename.split('.').pop();
            const newFilename = Date.now() + '.' + ext;
    
            // estas son propiedades de aws
            await client.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: newFilename,
                Body: fs.readFileSync(file.path),
                ACL: 'public-read',
                ContentType: mime.lookup(file.path),
            }));
            const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
            links.push(link);
        }
        return res.json({links});
    }
    
}

export const config = {
    api: { bodyParser: false }
}