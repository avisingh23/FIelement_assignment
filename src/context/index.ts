import path from 'path';
import config, { IConfig } from 'config';
import winston from 'winston';
import { IEmployeeController } from '../controllers/controller.interface';
import { DBConnection } from '../db';
import { EmployeeController } from '../controllers';
import { ILogger } from '../interfaces';
import { IContext } from './types';

export class Context implements IContext {
    controllers: {
        employeeController?: IEmployeeController;
    } = {};

    db: DBConnection;

    config: IConfig;

    logger: ILogger;

    getConfig(key: string) {
        return config.get(key);
    }

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}

const ctx = new Context();

export async function initContext() {
    // step - load config
    ctx.config = config;

    // step - load uploadDir
    const basePath = path.join(__dirname, '../../');
    const logsDir = path.join(basePath, 'logs');

    // step - load logger
    ctx.logger = ctx.isProduction()
        ? winston.createLogger({
              level: 'error',
              format: winston.format.json(),
              transports: [
                  new winston.transports.File({ dirname: logsDir, filename: 'error.log', level: 'error' }),
                  new winston.transports.File({ dirname: logsDir, filename: 'combined.log' }),
              ],
          })
        : winston.createLogger({
              level: 'info',
              format: winston.format.json(),
              transports: [new winston.transports.File({ dirname: logsDir, filename: 'combined.log' }), new winston.transports.Console()],
          });

    // step - init db connection
    ctx.db = new DBConnection({
        uri: config.get('app.mongodb.uri'),
        options: {
            autoIndex: true,
            autoCreate: true,
            dbName: config.get('app.mongodb.db'),
        },
    });
    await ctx.db.connect(config.get('app.mongodb.debug'));
    await ctx.db.registerCollections();

    // controllers
    ctx.controllers.employeeController = new EmployeeController({
        employeeRepository: ctx.db.repository.employee,
        transactionRepository: ctx.db.repository.transaction,
    });
}

export function loadContext() {
    return ctx;
}
