import * as z from 'zod';

type EmptyErrorMap = z.core.$ZodErrorMap<z.core.$ZodIssueInvalidType<unknown>>;

const emptyErrorMap: EmptyErrorMap = (issue) => {
    const field: string = issue.path?.join('.')!;
    if (issue.code === 'invalid_type' && issue.expected === 'undefined') {
        return { message: `${field}  é obrigatório.` };
    }
};

export default emptyErrorMap;
