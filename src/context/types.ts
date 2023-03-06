import { IConfig } from 'config';
import { IEmployeeController } from '../controllers/controller.interface';
import { DBConnection } from '../db';
import { ILogger } from '../interfaces';

export interface IContext {
    controllers: {
        employeeController?: IEmployeeController;
    };

    db: DBConnection;

    config: IConfig;

    logger: ILogger;

    getConfig(key: string): unknown;

    isProduction(): boolean;
}
