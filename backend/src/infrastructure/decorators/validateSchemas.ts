import { Context } from "hono";
import { ZodType, ZodError } from "zod";

export const zodErrorIntoString = (error: ZodError): string => {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
};

export type Controller = (c: Context) => any;

export const validBody = "validBody";
export const validParam = "validParam";
export const validQuery = "validQuery";

export const ValidateSchema = 
  (
    schema: ZodType<any>, 
    type: "body" | "param" | "query" = "body"
  ) => 
  (
    target: any, 
    propertyKey: string, 
    descriptor: TypedPropertyDescriptor<Controller>
  ) => {
    
    const originalMethod = descriptor.value!;

    descriptor.value = async function (c: Context) {
      let dataToValidate;
      
      try {
        if (type === "body") {
          dataToValidate = await c.req.json();

        } else if (type === "param") {
          dataToValidate = c.req.param();

        } else if (type === "query") {
          dataToValidate = c.req.query();
        }
        
      } catch (error) {
        dataToValidate = {}; 
      }

      const schemaResponse = schema.safeParse(dataToValidate);
      
      if (!schemaResponse.success) {
        console.log(`Zod error en [${type}]`, dataToValidate);
        
        return c.json(
          { message: zodErrorIntoString(schemaResponse.error) }, 
          400
        );
      }
      
      const contextKey = 
        type === "body" ? validBody : 
        type === "param" ? validParam : validQuery;
        
      c.set(contextKey, schemaResponse.data);

      return await originalMethod.apply(this, [c]);
    };
};