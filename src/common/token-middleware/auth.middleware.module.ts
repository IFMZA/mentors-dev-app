/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensSchema } from 'src/models/auth/tokens.model';
import { AuthMiddlewareService } from './auth.middleware.service';
import { AuthMiddleWare } from './auth.middleware';
import { TOKEN_MODEL_NAME } from '../constants';


@Module({
    imports: [MongooseModule.forFeature([
        { name: TOKEN_MODEL_NAME, schema: TokensSchema }
    ])],
    controllers: [],
    providers: [AuthMiddlewareService],
})
export class AuthMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleWare)
            .forRoutes('*')
    }
}
