import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BbsCtgry,
  BbsCttClick,
  Bbs,
  BbsImage,
  BbsctAnswer,
  Bbsctt,
  BbscttAnswerImage,
  BbsRecomend,
  BbsSttemnt,
  PrhibtWord,
} from '@app/share/models/community';
import { BbscttRepositroy, BbsRepositroy, BbscttAnswerRepositroy } from './repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BbsCtgry,
      BbsCttClick,
      Bbs,
      BbsImage,
      BbsctAnswer,
      Bbsctt,
      BbscttAnswerImage,
      BbsRecomend,
      BbsSttemnt,
      PrhibtWord,
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, BbscttRepositroy, BbsRepositroy, BbscttAnswerRepositroy],
})
export class CommunityModule {}
