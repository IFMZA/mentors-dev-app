/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConnection } from './common/utils/dbConnection'
import { UsersModule } from './users/users.module';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './common/auth/roles.guard';
import { AuthModule } from './auth/auth.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { AuthMiddlewareModule } from './common/token-middleware/auth.middleware.module';
import { MentorPackagesModule } from './mentorPackages/mentorPackages.module';
import { MentorAvailableSlotsModule } from './mentorAvailableSlots/mentorAvailableSlots.module';
import { SessionsModule } from './sessions/sessions.module';
import { CommentsModule } from './comments/comments.module';
import { RepliesModule } from './replies/replies.module';

@Module({
    imports: [
        MongooseModule.forRoot(dbConnection.getConnection().connection, { dbName: dbConnection.getConnection().dbName }),
        UsersModule, AuthModule, ForgotPasswordModule, AuthMiddlewareModule, MentorPackagesModule, MentorAvailableSlotsModule,
        SessionsModule, CommentsModule, RepliesModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
