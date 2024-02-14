"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
const https = require("https");
const path = require("path");
async function bootstrap() {
    try {
        const privateKeyPath = process.env.PRIVATE_KEY_PATH || path.join(__dirname, '../privkey.pem');
        const certificatePath = process.env.CERTIFICATE_PATH || path.join(__dirname, '../fullchain.pem');
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        const certificate = fs.readFileSync(certificatePath, 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const httpsServer = https.createServer(credentials, app.getHttpAdapter().getInstance());
        const port = 443;
        app.enableCors({
            methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
        });
        await app.listen(5000);
        httpsServer.listen(port, () => {
            console.log(`Server running on https://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Error during startup:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map