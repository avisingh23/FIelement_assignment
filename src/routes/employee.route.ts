import { Router, Request, Response } from 'express';
import { asyncHandler, validateRequestBody, validateBasicAuth } from '../middlewares';
import { Context } from '../context';
import { EmployeeApiSchema } from '../controllers';

function loadEmployeeRouter(ctx: Context) {
    const router = Router();
    router.post(
        '/',
        validateBasicAuth(ctx),
        asyncHandler(validateRequestBody(EmployeeApiSchema.addEmployee)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.employeeController?.addEmployee(req, res)),
    );
    router.get(
        '/',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.employeeController?.getEmployees(req, res)),
    );
    router.get(
        '/:employeeId',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.employeeController?.getEmployeeById(req, res)),
    );
    router.patch(
        '/:employeeId',
        validateBasicAuth(ctx),
        asyncHandler(validateRequestBody(EmployeeApiSchema.updateEmployee)),
        asyncHandler((req: Request, res: Response) => ctx.controllers.employeeController?.updateEmployeeById(req, res)),
    );
    router.delete(
        '/:employeeId',
        validateBasicAuth(ctx),
        asyncHandler((req: Request, res: Response) => ctx.controllers.employeeController?.deleteEmployeeById(req, res)),
    );

    return router;
}

export default loadEmployeeRouter;
