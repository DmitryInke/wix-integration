import { Test, TestingModule } from '@nestjs/testing';
import { WixApiService } from './wix-api.service';

describe('WixApiService', () => {
  let service: WixApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WixApiService],
    }).compile();

    service = module.get<WixApiService>(WixApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
