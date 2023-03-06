import { Schema, model } from 'mongoose';
import { ITransaction } from '../interfaces';

const transactionSchema = new Schema<ITransaction>(
    {
        transactionType: { type: String, required: true },
        employeeId: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: 'transaction',
    },
);
// eslint-disable-next-line func-names
transactionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

transactionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        // eslint-disable-next-line no-param-reassign
        delete ret._id;
    },
});

export const Transaction = model<ITransaction>('transaction', transactionSchema);
