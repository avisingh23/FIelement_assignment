import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IEmployee extends IBaseModel {
    name: String;
    email: String;
    phone: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
