import { Module } from '@nestjs/common';

import { AuthResolver } from '@auth/auth.resolver';
import { AuthService } from '@auth/auth.service';
import { GqlAuthGuard } from '@auth/guards/gql-auth.guard';
import { ConfigModule } from '@config/config.module';

@Module({
  exports: [AuthService, GqlAuthGuard],
  imports: [ConfigModule],
  providers: [AuthResolver, AuthService, GqlAuthGuard],
})
export class AuthModule {}
