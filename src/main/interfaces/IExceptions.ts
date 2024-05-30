/**
 * Defines exceptions to be ignored during scanning.
 * Exceptions are specified by their names and can have additional properties.
 */
export interface IExceptions {
  // Exception name is the key, representing the type of exception
  [exceptionName: string]: {
    // Each exception may have multiple properties, represented by keys
    [property: string]: any[]; // Array of values for the property
  };
}
