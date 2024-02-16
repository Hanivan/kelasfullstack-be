import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, any> {
    return {
      fe_repo: 'https://github.com/raflydjanas/social-app',
      be_repo: 'https://github.com/Hanivan/kelasfullstack-be',
      api_docs: 'https://documenter.getpostman.com/view/16770115/2sA2r6ZQrt',
    };
  }
}
