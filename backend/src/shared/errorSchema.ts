export const stringError = (field: string) => ({
    error: (issue: { input: unknown }) => 
        issue.input === undefined 
            ? `El ${field} es obligatorio` 
            : `El ${field} debe ser un texto`
});

export const numberError = (field: string) => ({
    error: (issue: { input: unknown }) => 
        issue.input === undefined 
            ? `El ${field} es obligatorio` 
            : `El ${field} debe ser un número`
});