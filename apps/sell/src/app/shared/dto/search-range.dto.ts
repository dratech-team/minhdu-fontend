import { Transform } from 'class-transformer';

export class SearchRangeDto {
  readonly createdAt_start?: Date;
  readonly  createdAt_end?: Date;
  @Transform((val) => {
    console.log("hihihi")
    return "hihihhii"
  })
  readonly endedAt_start?: Date;
  readonly endedAt_end?: Date;
  readonly  deliveredAt_start?: Date;
  readonly  deliveredAt_end?: Date;
}
