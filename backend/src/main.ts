import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:5173',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8081',
        'http://127.0.0.1:5173',
      ];
      const isAllowed =
        !origin ||
        allowed.includes(origin) ||
        origin.endsWith('.vercel.app');
      callback(null, isAllowed);
    },
    credentials: true,
  });
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
