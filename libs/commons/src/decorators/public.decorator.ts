import { SetMetadata } from '@nestjs/common';

export const PublicEndpoint = () => SetMetadata('isPublicEndpoint', true);
