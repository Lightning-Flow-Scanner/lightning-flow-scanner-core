import { IExceptions } from "./IExceptions";
import { IRuleOptions } from "./IRuleOptions";

export default interface IRulesConfig {
    rules?: IRuleOptions;
    exceptions?: IExceptions;
  }
  