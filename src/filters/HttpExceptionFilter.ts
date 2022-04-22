import { PlatformContext, ResponseErrorObject } from "@tsed/common";
import { Catch, ExceptionFilterMethods } from "@tsed/platform-exceptions";
import { Exception } from "@tsed/exceptions";

@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilterMethods {
    catch(exception: Exception, ctx: PlatformContext) {
        const { response, logger } = ctx;
        const error = this.mapError(exception);
        const headers = this.getHeaders(exception);

        logger.error({
            error
        })

        response.setHeaders(headers).status(exception.status).body(error);
    }

    mapError(error: any) {
        return {
            message: error.message
        }
    }

    protected getHeaders(error: any) {
        return [error, error.origin].filter(Boolean).reduce((obj, { headers }: ResponseErrorObject) => {
            return {
                ...obj,
                ...(headers || {})
            }
        }, {})
    }
}