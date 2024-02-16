import { Obs, ObsHelperSym } from '@libs/commons/constant';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { arrayNotEmpty, isEmpty } from 'class-validator';
import { createHash } from 'crypto';
import { stat } from 'fs';
import { Client } from 'minio';
import { promisify } from 'util';
import { ObsHelperOptions } from './obs-helper.module';

const statAsync = promisify(stat);

@Injectable()
export class ObsHelperService {
  private readonly logger = new Logger(ObsHelperService.name);
  private readonly client: Client;

  constructor(@Inject(ObsHelperSym) private options: ObsHelperOptions) {
    if (isEmpty(options?.useSecure)) options.useSecure = true;
    if (isEmpty(options?.endpointUrl)) {
      this.logger.warn(`JWT_EXPIRES_IN are not set`)
      return
    };

    this.client = new Client({
      endPoint: options?.endpointUrl,
      accessKey: options?.accessKey,
      secretKey: options?.secretKey,
      useSSL: options?.useSecure,
    });
  }

  async storeFileToObs(
    files: Express.Multer.File[],
    userId: number,
    path: string = Obs.defaultUploadedDirectory,
  ) {
    console.log({files,userId,path})
    return
    if (!path.endsWith('/')) path += '/';

    try {
      if (!arrayNotEmpty(files)) return;

      for (const file of files) {
        if (isEmpty(file)) return;

        const objectName = this.createObjectName(
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
        `${path}${this.createObjectName(
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

  private createObjectName(
    fileName: string,
    fieldName: string,
    userId?: number,
  ) {
    const extFile = fileName?.split('.');

    return (
      this.hashMD5(`${userId}-${fieldName}`) + `.${extFile[extFile.length - 1]}`
    );
  }

  private hashMD5(rawText: string) {
    return createHash('md5').update(rawText).digest('hex');
  }
}
