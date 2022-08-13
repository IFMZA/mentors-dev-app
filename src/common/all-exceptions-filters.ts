/* eslint-disable prettier/prettier */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    InternalServerErrorException
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: InternalServerErrorException, host: ArgumentsHost) {
        console.log(exception.name);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        /**
         * @description Exception json response
         * @param message
         */
        let _message = "";
        try {
            _message = exception.getResponse()["message"];
        } catch (error) {
            _message = exception.message;
        }
        const responseMessage = (type, message) => {
            response.status(status).json({
                statusCode: status,
                path: request.url,
                errorType: type,
                errorMessage: _message
            });
        };

        // Throw an exceptions for either
        // MongoError, ValidationError, TypeError, CastError and Error
        if (exception.message) {
            responseMessage("Error", exception);
        } else {
            responseMessage(exception.name, exception.message);
        }
    }
}