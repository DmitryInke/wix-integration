import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { WixApiModule } from './wix-api/wix-api.module';
import { RedisCacheModule } from './common/cache/redis-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProductsModule,
    WixApiModule,
    RedisCacheModule,
  ],
})
export class AppModule {}
