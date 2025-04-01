import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../config/configuration-app';
import databaseConfig from '../config/configuration-database';
import emailConfig from '../config/configuration-email';
import { validationSchema } from '../config/validation/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { UsersModule } from './users/users.module';
import { ParkingLotsModule } from './parking-lots/parking-lots.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ParkingHistoryModule } from './parking-history/parking-history.module';
import { AuthModule } from './auth/auth.module';
import { JwtConfigModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/.env.${process.env.NODE_ENV}`,
      load: [appConfig, databaseConfig, emailConfig],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    ParkingLotsModule,
    VehiclesModule,
    ParkingHistoryModule,
    AuthModule,
    JwtConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
