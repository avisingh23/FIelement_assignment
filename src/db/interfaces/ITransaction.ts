import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface ITransaction extends IBaseModel {
    transactionType: String;
    employeeId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
