import { ResponseItems } from '../../shared/interfaces/response-items.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../user.model';

export class ResponseUsersDto implements ResponseItems<UserModel> {
  @ApiProperty({ type: [UserModel] })
  data: UserModel[];

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  totalPages: number;
}
