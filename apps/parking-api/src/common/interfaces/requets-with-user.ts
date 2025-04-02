import { User } from '../../users/entities/user.entity';

export interface RequestWithUserInterface extends Request {
  user: User;
}
