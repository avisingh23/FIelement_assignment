import { Request, Response } from 'express';

export interface IController {}

export interface IEmployeeController extends IController {
    addEmployee(req: Request, res: Response): Promise<Response>;
    getEmployees(req: Request, res: Response): Promise<Response>;
    getEmployeeById(req: Request, res: Response): Promise<Response>;
    updateEmployeeById(req: Request, res: Response): Promise<Response>;
    deleteEmployeeById(req: Request, res: Response): Promise<Response>;
}
