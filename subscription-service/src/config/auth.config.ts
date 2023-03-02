import { ConfigService } from '@nestjs/config';

export const getAuthConfig = () => {
  const configService = new ConfigService();
  const authSecretKey = configService.get('AUTH_SECRET_KEY');
  const expiresIn = configService.get('JWT_TOKEN_EXPIRATION_IN_SECONDS');

  if (!authSecretKey) throw new Error('Auth secret is not defined');
  if (!expiresIn) throw new Error('No expiration not defined');

  return {
    secret: authSecretKey,
    signOptions: { expiresIn },
  };
};

export const loadAuthSecret = () => {
  const configService = new ConfigService();
  const authSecretKey = configService.get('AUTH_SECRET_KEY');
  if (!authSecretKey) throw new Error('Auth secret is not defined');

  return authSecretKey;
};
