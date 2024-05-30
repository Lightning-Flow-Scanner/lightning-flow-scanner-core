import { IExceptions } from "./IExceptions";
import { IRuleOptions } from "./IRuleOptions";

/**
 * Configuration options for rules and exceptions.
 * Allows defining rules and exceptions to be applied during scanning.
 */
export interface IRulesConfig {
  // Rules to be executed during scanning
  rules?: IRuleOptions;
  // Exceptions to be ignored during scanning
  exceptions?: IExceptions;
}
