import { Result } from "ts-results";
import BaseError from "./../../Error/BaseError.js";

type UseCase<Form = unknown, Res = unknown, Errors extends Error = Error | BaseError, Context = undefined> =
  Context extends undefined
  ? { execute(form: Form): Promise<Result<Res, Errors>>; }
  : { execute(form: Form, context: Context): Promise<Result<Res, Errors>>; };
export default UseCase;
