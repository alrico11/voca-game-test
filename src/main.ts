import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { XConfig } from './xconfig';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors()
    const port = app.get(XConfig).env.APP_PORT
    const config = new DocumentBuilder()
      .setTitle('technical-test')
      .setVersion('v1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
      jsonDocumentUrl: '/docs.json'
    });
    await app.listen(port);
    console.log(`server run on http://localhost:${port}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
bootstrap();
