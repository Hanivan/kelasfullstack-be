export const SymMaxConLimit = Symbol('MAXCONLIMIT');
export const SymDefaultConfig = Symbol('DEFAULTCONFIG');
export const ObsHelperSym = Symbol('ObsHelper');

export enum EnvKey {
  APP_ENV = 'APP_ENV',
  OBS_ENDPOINT_URL = 'OBS_ENDPOINT_URL',
  ACCESS_KEY = 'ACCESS_KEY',
  SECRET_KEY = 'SECRET_KEY',
  BUCKET_NAME = 'BUCKET_NAME',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
}

export enum DBKey {
  DB_MAIN = 'DB_MAIN',
  DB_SECONDARY = 'DB_SECONDARY',
}

export namespace Obs {
  export const defaultUploadedDirectory = 'assets/kelasfullstack/';
}
