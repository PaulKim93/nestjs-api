import { Injectable } from '@nestjs/common';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Mber } from '@app/share/models/user/mber.entity';
@Injectable()
export class MberRepositroy extends Repository<Mber> {
  constructor(private dataSource: DataSource) {
    super(Mber, dataSource.createEntityManager());
  }
}
