import { Request, Response } from 'express';
import { Model, ObjectId } from 'mongoose';
import Joi from 'joi';
import { RequestHelper } from '../helpers/index';
import { IEmployee, ITransaction } from '../db/interfaces';
import { IPagination } from '../interfaces';
import { IEmployeeController } from './controller.interface';
import { Errors, HttpException } from '../error';
import { IPaginationParams, ISortByParams } from './types';

interface EmployeeControllerParams {
    employeeRepository: Model<IEmployee>;
    transactionRepository: Model<ITransaction>;
}

interface IEmployeeFilterParams extends IPaginationParams, ISortByParams {
    name?: string;
    email?: string;
    phone?: number;
    id?: ObjectId;
}

function createResponse(employee: IEmployee) {
    return {
        employee,
    };
}

function createPaginationResponse(response: any[], pagination: IPagination) {
    return {
        data: response,
        pagination,
    };
}

export const EmployeeApiSchema = {
    addEmployee: Joi.object({
        name: Joi.string().trim().normalize().required(),
        email: Joi.string().email().trim().normalize().required(),
        phone: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({ 'string.pattern.base': Errors.mobileValidation.err0301.error })
            .required(),
    }).required(),
    updateEmployee: Joi.object({
        name: Joi.string().trim().normalize().required(),
        email: Joi.string().email().trim().normalize().required(),
        phone: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({ 'string.pattern.base': Errors.mobileValidation.err0301.error })
            .required(),
    }).required(),
};

export class EmployeeController implements IEmployeeController {
    employeeRepository: Model<IEmployee>;
    transactionRepository: Model<ITransaction>;

    constructor(params: EmployeeControllerParams) {
        this.employeeRepository = params.employeeRepository;
        this.transactionRepository = params.transactionRepository;
    }

    async addEmployee(req: Request, res: Response): Promise<Response> {
        const { name, email, phone } = req.body;
        const employee = await this.employeeRepository.create({ name, email, phone });
        if (!employee) {
            throw new HttpException(400, '', Errors.employee.err0402.error, Errors.employee.err0402.code);
        }
        const transaction = await this.transactionRepository.create({ transactionType: 'addEmployee', employeeId: employee._id });
        if (!transaction) {
            throw new HttpException(400, '', Errors.transaction.err0502.error, Errors.transaction.err0502.code);
        }
        return res.json({ employee, transaction });
    }

    async getEmployeeById(req: Request, res: Response): Promise<Response> {
        const { employeeId } = req.params;
        const employee = await this.employeeRepository.findOne({ _id: employeeId });
        if (!employee) {
            throw new HttpException(400, '', Errors.employee.err0401.error, Errors.employee.err0401.code);
        }
        const transaction = await this.transactionRepository.create({ transactionType: 'getEmployeeById', employeeId: employee._id });
        if (!transaction) {
            throw new HttpException(400, '', Errors.transaction.err0502.error, Errors.transaction.err0502.code);
        }
        return res.json({ employee, transaction });
    }

    async getEmployees(req: Request, res: Response): Promise<Response> {
        const filterQuery: IEmployeeFilterParams = req.query;
        const { offset, limit } = RequestHelper.parsePaginationParams(filterQuery);
        const sortBy = RequestHelper.parseSortByParams(filterQuery);
        const criteria: any = {};
        if (filterQuery.name) {
            criteria.name = {
                $eq: filterQuery.name,
            };
        }
        if (filterQuery.email) {
            criteria.email = {
                $eq: filterQuery.email,
            };
        }
        if (filterQuery.phone) {
            criteria.phone = {
                $eq: filterQuery.phone,
            };
        }
        if (filterQuery.id) {
            criteria._id = {
                $eq: filterQuery.id,
            };
        }

        const totalEmployees = await this.employeeRepository.where(criteria).count();
        const query = this.employeeRepository.where(criteria);
        query.skip(offset);
        if (limit) {
            query.limit(limit);
        }
        if (sortBy) {
            query.sort(sortBy);
        }
        const employees = await query.find();
        const data = employees.map((item) => createResponse(item));
        const pagination: IPagination = {
            offset,
            total: totalEmployees,
            count: employees.length,
            limit: limit || -1,
        };
        const response = createPaginationResponse(data, pagination);
        const transaction = await this.transactionRepository.create({ transactionType: 'getAllEmployees', employeeId: 'All' });
        if (!transaction) {
            throw new HttpException(400, '', Errors.transaction.err0502.error, Errors.transaction.err0502.code);
        }
        return res.json({ response, transaction });
    }

    async updateEmployeeById(req: Request, res: Response): Promise<Response> {
        const {
            params: { employeeId },
            body: { name, email, phone },
        } = req;
        const data = await this.employeeRepository.findOne({ _id: employeeId });
        if (!data) {
            throw new HttpException(400, '', Errors.employee.err0401.error, Errors.employee.err0401.code);
        }
        const employee = await this.employeeRepository.findByIdAndUpdate(
            employeeId,
            {
                $set: { name, email, phone },
            },
            { new: true },
        );
        if (!employee) {
            throw new HttpException(400, '', Errors.employee.err0401.error, Errors.employee.err0401.code);
        }
        const transaction = await this.transactionRepository.create({ transactionType: 'updateEmployeeById', employeeId: employee._id });
        if (!transaction) {
            throw new HttpException(400, '', Errors.transaction.err0502.error, Errors.transaction.err0502.code);
        }
        return res.json({ employee, transaction });
    }

    async deleteEmployeeById(req: Request, res: Response): Promise<Response> {
        const { employeeId } = req.params;
        const employee = await this.employeeRepository.findOne({ _id: employeeId });
        if (!employee) {
            throw new HttpException(400, '', Errors.employee.err0401.error, Errors.employee.err0401.code);
        }
        employee.remove();
        employee.save();
        const transaction = await this.transactionRepository.create({ transactionType: 'deleteEmployeeById', employeeId: employee._id });
        if (!transaction) {
            throw new HttpException(400, '', Errors.transaction.err0502.error, Errors.transaction.err0502.code);
        }
        return res.json(transaction);
    }
}
