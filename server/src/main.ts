import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS',
  });
  await app.listen(5000);
}
bootstrap();
