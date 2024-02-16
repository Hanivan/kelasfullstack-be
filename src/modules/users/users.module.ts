import { UsersEntity } from '@entities/users.entity';
import { EnvKey } from '@libs/commons/constant';
import { ObsHelperModule } from '@libs/helpers/obs-helper/obs-helper.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ObsHelperModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endpointUrl: config.get<string>(EnvKey.OBS_ENDPOINT_URL),
          accessKey: config.get<string>(EnvKey.ACCESS_KEY),
          secretKey: config.get<string>(EnvKey.SECRET_KEY),
          bucketName: config.get<string>(EnvKey.BUCKET_NAME),
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
