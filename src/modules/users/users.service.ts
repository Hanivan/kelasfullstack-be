import { UsersEntity } from '@entities/users.entity';
import { ObsHelperService } from '@libs/helpers/obs-helper/obs-helper.service';
import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { isNotEmptyObject } from 'class-validator';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/dtos/pagination.dto';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private readonly eManager: EntityManager,
    private readonly obsHelperService: ObsHelperService,
  ) {}

  private readonly usersTableName = 'users';

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findEmail(createUserDto?.email);
    if (isNotEmptyObject(userExists))
      throw new UnprocessableEntityException('user already exists');

    // for now username === email
    const hashedPassword = hashSync(createUserDto.password, 10);
    createUserDto.username = createUserDto?.email;
    createUserDto.password = hashedPassword;

    try {
      const user = this.usersEtityMetadata.create(createUserDto);
      const res = await this.usersEtityMetadata
        .createQueryBuilder()
        .insert()
        .values(user)
        .execute();
      return res?.generatedMaps[0];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(pageOptDto: PageOptionsDto): Promise<PageDto<UsersDto[]>> {
    try {
      const [res, itemCount] = await this.usersEtityMetadata.findAndCount();
      const pageMetaDto = new PageMetaDto({
        itemCount,
        pageOptionsDto: pageOptDto,
      });

      return {
        data: plainToInstance(UsersDto, res),
        meta: pageMetaDto,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<PageDto<UsersDto>> {
    try {
      const res = await this.usersEtityMetadata.findOneBy({
        id: BigInt(id),
      });

      return {
        data: plainToInstance(UsersDto, res),
        meta: null,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findEmail(email: string) {
    try {
      return this.usersEtityMetadata.findOneBy({ email });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    avatar: Express.Multer.File,
  ) {
    this.obsHelperService.storeFileToObs([avatar], id);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    throw new NotImplementedException();
  }

  /**
   *
   */

  private get usersEtityMetadata() {
    return this.eManager.connection.getRepository(UsersEntity);
  }
}
