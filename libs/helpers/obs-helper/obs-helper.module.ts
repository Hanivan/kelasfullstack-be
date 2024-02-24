import { ObsHelperSym } from '@libs/commons/constant';
import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { EncryptionModule } from '../encryption/encryption.module';
import { ObsHelperService } from './obs-helper.service';

export interface ObsHelperOptions {
  endpointUrl: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  useSecure?: boolean;
}

type HuaweiObsHelperAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ObsHelperOptions>, 'useFactory' | 'inject'>;

@Module({
  imports: [EncryptionModule],
  providers: [ObsHelperService],
  exports: [ObsHelperService],
})
export class ObsHelperModule {
  static register(options: ObsHelperOptions): DynamicModule {
    const mergedOptions: ObsHelperOptions = {
      ...options,
      useSecure: false,
    };

    return {
      module: ObsHelperModule,
      providers: [
        { provide: ObsHelperSym, useValue: mergedOptions },
        ObsHelperService,
      ],
      exports: [ObsHelperService],
    };
  }

  static registerAsync(options: HuaweiObsHelperAsyncOptions): DynamicModule {
    return {
      module: ObsHelperModule,
      providers: [
        {
          provide: ObsHelperSym,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        ObsHelperService,
      ],
      exports: [ObsHelperService],
    };
  }
}
