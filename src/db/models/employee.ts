import { Schema, model } from 'mongoose';
import { IEmployee } from '../interfaces';

const employeeSchema = new Schema<IEmployee>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number },
        deletedAt: { type: Date },
    },
    {
        timestamps: true,
        collection: 'employee',
    },
);
// eslint-disable-next-line func-names
employeeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

employeeSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
    },
});

export const Employee = model<IEmployee>('employee', employeeSchema);
