import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class YupValidationPipe implements PipeTransform {
    constructor(private readonly schema: any) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            await this.schema.validate(value, { abortEarly: false });
        } catch (err) {
            const errors = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            throw new BadRequestException(errors);
        }
        return value;
    }
}
