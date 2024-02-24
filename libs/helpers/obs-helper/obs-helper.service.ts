import { Obs, ObsHelperSym } from '@libs/commons/constant';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { arrayNotEmpty, isEmpty } from 'class-validator';
import { stat } from 'fs';
import { Client } from 'minio';
import { promisify } from 'util';
import { EncryptionService } from '../encryption/encryption.service';
import { ObsHelperOptions } from './obs-helper.module';

const statAsync = promisify(stat);

@Injectable()
export class ObsHelperService {
  private readonly logger = new Logger(ObsHelperService.name);
  private readonly client: Client;
  fullUrlObs: string = '';

  constructor(
    @Inject(ObsHelperSym) private options: ObsHelperOptions,
    private readonly encryptionService: EncryptionService,
  ) {
    if (isEmpty(options?.useSecure)) options.useSecure = true;
    if (isEmpty(options?.endpointUrl)) {
      this.logger.warn(`OBS_ENDPOINT_URL are not set`);
      return;
    }

    this.client = new Client({
      endPoint: options?.endpointUrl,
      accessKey: options?.accessKey,
      secretKey: options?.secretKey,
      useSSL: options?.useSecure,
    });
    this.fullUrlObs = `https://${options?.endpointUrl}/${options?.bucketName}/${Obs.defaultUploadedDirectory}`;
  }

  async storeFileToObs(
    files: Express.Multer.File[],
    userId: number,
    path: string = Obs.defaultUploadedDirectory,
  ) {
    if (!path.endsWith('/')) path += '/';

    try {
      if (!arrayNotEmpty(files)) return;
      for (const file of files) {
        if (isEmpty(file)) return;
        const objectName = this.encryptionService.createObjectName(
          file?.originalname,
          file?.fieldname,
          userId,
        );
        const objInfo = await this.client.putObject(
          this.options.bucketName,
          `${path}${objectName}`,
          file?.buffer,
          file?.size,
          {
            'x-amz-acl': 'public-read',
            'Content-Disposition': 'inline',
            'Content-Type': file?.mimetype,
          },
        );
        this.logger.debug('Success', objInfo);
      }
    } catch (err) {
      console.error('Error uploading file to MinIO:', err);
    }
  }

  async removeFileOnObs(
    files: Express.Multer.File[],
    userId: number,
    path: string = Obs.defaultUploadedDirectory,
  ) {
    if (!path.endsWith('/')) path += '/';

    let objectNames: string[] = [];

    for (const file of files) {
      objectNames.push(
        `${path}${this.encryptionService.createObjectName(
          file?.originalname,
          file?.fieldname,
          userId,
        )}`,
      );
    }

    this.client.removeObjects(this.options.bucketName, objectNames, (e) => {
      this.logger.debug(`removed files: ${objectNames}`);
    });
  }
}
