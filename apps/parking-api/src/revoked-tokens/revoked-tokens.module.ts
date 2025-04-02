import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevokedTokensService } from './service/revoked-tokens.service';
import { RevokedToken } from './entities/revoked-tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RevokedToken])],
  providers: [RevokedTokensService],
  exports: [RevokedTokensService],
})
export class RevokedTokensModule {}
