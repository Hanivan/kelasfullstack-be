import { EnvKey } from '@libs/commons/constant';
import { LogLevel, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let port: number;

async function bootstrap() {
  const configModule = await NestFactory.createApplicationContext(ConfigModule);
  const configService = configModule.get(ConfigService);
  port = configService.get<number>(EnvKey.APP_PORT, 3000);
  const isDev =
    configService.get<string>(EnvKey.APP_ENV, 'production') === 'development';
  const logger: LogLevel[] = isDev
    ? ['log', 'warn', 'debug', 'error', 'verbose']
    : ['error', 'fatal', 'warn', 'verbose'];
  configModule.close();

  const app = await NestFactory.create(AppModule, { logger });

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
}
bootstrap().then(() => {
  Logger.verbose(`Api service run on ${port}`);
});
