import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PARTNER_KEY = 'isPartner';
export const IsPartner = (): CustomDecorator =>
  SetMetadata(IS_PARTNER_KEY, true);
