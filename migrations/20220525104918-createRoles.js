module.exports = {
    async up(db) {
        await db.collection('employee').insertOne({
            name: 'FiElement',
            email: 'fi87@gmail.com',
            phone: 8305372451,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await db.collection('transaction').insertOne({
            transactionType: 'manual',
            employeeId: 'emample',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    },

    async down(db) {
        await db.collection('employee').deleteOne({
            name: 'Employee',
        });
        await db.collection('employee').deleteOne({
            name: 'Employee',
        });
    },
};
