// @ts-nocheck
export class ObjectUtils {
  public static resolveFieldData(data: any, field: any): any {
    if (data && field) {
      if (this.isFunction(field)) {
        // If field is a function, call it with data as argument
        return field(data);
      } else if (field.indexOf(".") == -1) {
        // If field does not contain a dot, return the direct property => TO CHECK IF THIS IS NEEDED
        return data[field];
      } else {
        // If field contains dots, traverse the nested properties
        const fields: string[] = field.split("."); // Split field by dots to get individual property names
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  public static isFunction(obj: any) {
    // !! => Double negation operator converts a value to a boolean => true or false
    // Checks if obj is null or undefined
    // Then checks if obj has constructor, call, and apply properties (characteristics of functions) => Only functions have .apply()
    // Then returns true if all conditions are met, otherwise false
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }
}
