import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WixApiService } from './wix-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [WixApiService],
  exports: [WixApiService],
})
export class WixApiModule {}
