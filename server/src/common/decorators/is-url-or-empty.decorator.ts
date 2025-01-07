import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isURL } from 'validator';

export function IsUrlOrEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUrlOrEmpty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          return typeof value === 'string' && (value === '' || isURL(value));
        },
        defaultMessage: (args: ValidationArguments) => {
          return `${args.property} must be a valid URL or an empty string`;
        },
      },
    });
  };
}
