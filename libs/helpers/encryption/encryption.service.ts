import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  createObjectName(fileName: string, fieldName: string, userId?: number) {
    const extFile = fileName?.split('.');

    return (
      this.hashMD5(`${userId}-${fieldName}`) + `.${extFile[extFile.length - 1]}`
    );
  }

  randomToken(length: number = 32) {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  hashMD5(rawText: string) {
    return createHash('md5').update(rawText).digest('hex');
  }
}
