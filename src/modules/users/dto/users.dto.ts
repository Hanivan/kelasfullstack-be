import { Exclude, Expose, Transform } from 'class-transformer';

export class UsersDto {
  @Transform(({ value }) => Number(value))
  @Expose()
  id: BigInt;

  @Expose()
  title: string;

  @Expose()
  name: string;

  @Expose()
  bio: string;

  @Expose()
  email: string;

  @Exclude()
  username: string;

  @Exclude()
  password: string;

  @Expose()
  avatar_url: string;

  @Exclude()
  remember_token: string;

  @Expose()
  n_status: number;

  @Exclude()
  last_login: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Exclude()
  deleted_at: Date;
}
