/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConnection } from './common/utils/dbConnection'
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/auth/roles.guard';
import { AuthModule } from './auth/auth.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { AuthMiddlewareModule } from './common/token-middleware/auth.middleware.module';

@Module({
    imports: [
        MongooseModule.forRoot(dbConnection.getConnection().connection, { dbName: dbConnection.getConnection().dbName }),
        UsersModule, AuthModule, ForgotPasswordModule, AuthMiddlewareModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
