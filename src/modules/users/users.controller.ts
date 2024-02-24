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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(AnyFilesInterceptor({ limits: { files: 2 } }))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3145728,
            message: 'file size should not exceed 3Mb',
          }), // 3Mb
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/i }),
        ],
        fileIsRequired: false,
      }),
    )
    userAttachment: Express.Multer.File[],
  ) {
    return this.usersService.update(+id, updateUserDto, userAttachment);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
