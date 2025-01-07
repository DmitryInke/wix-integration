import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsUrlOrEmpty } from 'src/common/decorators/is-url-or-empty.decorator';

// Enum for product type
enum ProductType {
  PHYSICAL = 'physical',
}

// DTO for product option choices
class ProductOptionChoiceDto {
  @IsString()
  value: string;

  @IsString()
  description: string;
}

// DTO for product options
class ProductOptionDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionChoiceDto)
  choices: ProductOptionChoiceDto[];
}

// Main DTO for creating a product
export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(ProductType)
  productType: ProductType;

  @IsUrlOrEmpty()
  imageUrl?: string;

  @IsInt()
  @Min(0)
  inventory: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  productOptions: ProductOptionDto[];
}
