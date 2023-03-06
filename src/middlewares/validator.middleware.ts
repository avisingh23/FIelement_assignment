import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { HttpException } from '../error';

export const validateRequestBody = (schema: Joi.Schema) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await schema.validateAsync(req.body, {
                abortEarly: false,
                convert: true, // this will convert values are required
            });
            // overwrite body - due to conversion
            req.body = data;
            next();
        } catch (error) {
            res.status(422).send({
                errors: (error as any).details,
            });
        }
    };
};

export const validateBasicAuth = (ctx: Joi.Context) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const basicAuth = ctx.getConfig('app.basicAuth');
        const basicAuthHeader = req.header('BasicAuth');
        if (basicAuthHeader !== basicAuth) {
            throw new HttpException(401, '', 'Missing Auth!', '');
            // res.status(403).json({ error: 'Missing Auth!' }).send();
        } else {
            next();
        }
    };
};
