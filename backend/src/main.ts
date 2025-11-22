import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpertsService } from './experts/experts.service';
import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Включаем CORS для фронтенда
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Можно добавить несколько origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет поля, которых нет в DTO
    forbidNonWhitelisted: false, // Изменено на false для поддержки FormData с дополнительными полями
    transform: true, // Преобразует типы (строки в числа и т.д.)
  }));

  // Создаем папку uploads если её нет
  const uploadsDir = join(__dirname, '..', 'uploads');
  const expertsDir = join(uploadsDir, 'experts');
  const fs = await import('fs');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Создана папка uploads');
  }
  if (!fs.existsSync(expertsDir)) {
    fs.mkdirSync(expertsDir, { recursive: true });
    console.log('📁 Создана папка uploads/experts');
  }

  // Статические файлы - исправленный путь
  app.use('/uploads', express.static(uploadsDir));

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Experts API')
    .setDescription('API для системы экспертов-собеседников')
    .setVersion('1.0')
    .addTag('experts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    // Запускаем планировщик проверки истекших анкет
    const expertsService = app.get(ExpertsService);
    await expertsService.startExpirationChecker();
    console.log('✅ Планировщик истекших анкет запущен');
  } catch (error) {
    console.error('❌ Ошибка запуска планировщика:', error);
  }

  await app.listen(4000);
  console.log('🚀 Server is running on http://localhost:4000');
  console.log('📚 Swagger documentation: http://localhost:4000/api');
  console.log('📁 Static files: http://localhost:4000/uploads');
}

bootstrap().catch(error => {
  console.error('💥 Ошибка запуска приложения:', error);
  process.exit(1);
});