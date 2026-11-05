import { Controller, Get, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/small-web',
    ),
  ],
  controllers: [HealthController],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}

void bootstrap();

