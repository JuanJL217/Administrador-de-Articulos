import { Context } from 'hono';

export function CatchErrors() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (c: Context, ...args: any[]) {
            try {
                return await originalMethod.apply(this, [c, ...args]);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                
                const status = errorMessage.includes('no encontrado') ? 404 : 400;

                return c.json({ 
                    success: false,
                    error: errorMessage 
                }, status);
            }
        };

        return descriptor;
    };
}