export const Errors = {
    auth: {
        err0001: {
            code: 'ERR0001',
            error: 'Missing Auth!',
        },
    },
    employee: {
        err0401: {
            code: 'ERR0401',
            error: 'Employee Not Found',
        },
        err0402: {
            code: 'ERR0402',
            error: 'Employee Not Created due to server error',
        },
    },
    mobileValidation: {
        err0301: {
            code: 'ERR0301',
            error: 'phone number must be 10 digit number',
        },
    },
    transaction: {
        err0501: {
            code: 'ERR0501',
            error: 'Transaction Not Found',
        },
        err0502: {
            code: 'ERR0502',
            error: 'Failed to create transaction due to server error',
        },
    },
};
