import { PublicEndpoint } from '@libs/commons/decorators/public.decorator';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageOptionsDto } from 'src/dtos/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
// @Serialize(UsersDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @PublicEndpoint()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() pageOptDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3145728 }), // 3Mb
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/i }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    console.log(avatar, updateUserDto);
    return this.usersService.update(+id, updateUserDto, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
