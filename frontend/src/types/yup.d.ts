// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StringSchema } from "yup";

declare module "yup" {
  interface StringSchema {
    emailDuplicationCheck(message: string): StringSchema;
  }
}
