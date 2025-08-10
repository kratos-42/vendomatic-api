import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { UserResolver } from '@user/user.resolver';

@Module({
  imports: [AuthModule],
  providers: [UserResolver],
})
export class UserModule {}
