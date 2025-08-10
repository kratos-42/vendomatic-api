import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

import { LoginInput } from '@auth/dto/login.input';
import { RefreshTokenInput } from '@auth/dto/refresh-token.input';
import { AuthOutput, User } from '@auth/entities/auth.entity';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('supabase.url'),
      this.configService.get('supabase.key'),
    );
  }

  private mapSupabaseUserToUser(supabaseUser: SupabaseUser): User {
    if (!supabaseUser.email) {
      throw new UnauthorizedException('User email not found');
    }

    if (!supabaseUser.user_metadata?.role) {
      throw new UnauthorizedException('User role not defined');
    }

    return {
      email: supabaseUser.email,
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || null,
      role: supabaseUser.user_metadata.role,
    };
  }

  async getLoggedUser(accessToken: string): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    return this.mapSupabaseUserToUser(user);
  }

  async login(loginInput: LoginInput): Promise<AuthOutput> {
    const { email, password } = loginInput;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = this.mapSupabaseUserToUser(data.user);

    return {
      session: {
        accessToken: data.session.access_token,
        expiresIn: data.session.expires_in!,
        refreshToken: data.session.refresh_token,
      },
      user,
    };
  }

  async logout(accessToken: string): Promise<boolean> {
    const { error } = await this.supabase.auth.admin.signOut(accessToken);

    if (error) {
      throw new UnauthorizedException('Failed to logout');
    }

    return true;
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput): Promise<AuthOutput> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshTokenInput.refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = this.mapSupabaseUserToUser(data.user);

    return {
      session: {
        accessToken: data.session.access_token,
        expiresIn: data.session.expires_in!,
        refreshToken: data.session.refresh_token,
      },
      user,
    };
  }
}
