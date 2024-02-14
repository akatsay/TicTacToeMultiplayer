import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';


async function bootstrap() {
  try {
    const privateKeyPath = process.env.PRIVATE_KEY_PATH || path.join(__dirname, '../privkey.pem');
    const certificatePath = process.env.CERTIFICATE_PATH || path.join(__dirname, '../fullchain.pem');

    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    const app = await NestFactory.create(AppModule);
    const httpsServer = https.createServer(credentials, app.getHttpAdapter().getInstance());

    const port = 443;
    
    app.enableCors({
      // origin: '*',
      methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
    });
    await app.listen(5000);
    httpsServer.listen(port, () => {
      console.log(`Server running on https://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
  }
}

bootstrap();
