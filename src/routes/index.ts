import { Router, Request, Response } from 'express';
import { Context } from '../context';
import loadEmployeeRouter from './employee.route';

function loadRouter(ctx: Context) {
    const router = Router();
    router.get('/', (req: Request, res: Response) => {
        res.send('Hello FiElements');
    });
    router.use('/employee', loadEmployeeRouter(ctx));

    return router;
}

export default loadRouter;
