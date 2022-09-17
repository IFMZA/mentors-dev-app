/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions-filters';
import { DefaultValidationPipe } from './common/default-validation-pipe';
import { Swagger } from './common/utils/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
    const port = process.env.PORT || 3000
    app.useGlobalPipes(new DefaultValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableShutdownHooks();
    // app.setGlobalPrefix('api/v1');
    app.useStaticAssets(join(__dirname, '..', 'files'), {
        index: false,
        prefix: '/files',
    });

    Swagger.setup(app)


    await app.listen(port, '0.0.0.0', () => {

        console.log(`listening on port ${port}`)
        console.log(`Environment ${process.env.NODE_ENV}`)
    });
}
bootstrap();
