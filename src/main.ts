import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CRITICAL: CORS CONFIGURATION ---
  app.enableCors({
    // Allow requests from our Angular development server
    origin: 'http://localhost:8100', 
    // Allow all standard HTTP methods
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // Allow credentials (needed later for session/JWT authentication)
    credentials: true,
  });
  // --- END CORS CONFIGURATION ---

  // Set the global API prefix (optional, but good practice)
  // We'll set the global prefix to 'v1' to match our controller design
  app.setGlobalPrefix('v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
