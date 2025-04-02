import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsGreaterThanZero', async: false })
export class IsGreaterThanZeroValidator
  implements ValidatorConstraintInterface
{
  validate(value: number) {
    return value > 0;
  }

  defaultMessage(): string {
    return 'The value must be greater than 0';
  }
}

export function IsGreaterThanZero(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsGreaterThanZeroValidator,
    });
  };
}
