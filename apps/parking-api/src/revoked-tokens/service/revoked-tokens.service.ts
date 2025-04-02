import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevokedToken } from '../entities/revoked-tokens.entity';

@Injectable()
export class RevokedTokensService {
  constructor(
    @InjectRepository(RevokedToken)
    private readonly revokedTokenRepository: Repository<RevokedToken>,
  ) {}

  async revokeToken(token: string): Promise<void> {
    await this.revokedTokenRepository.save({ token });
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const tokenExists: RevokedToken | null =
      await this.revokedTokenRepository.findOne({
        where: { token },
      });
    return !!tokenExists;
  }
}
