export interface ProductModel {
  description?: string;
  longDescription?: string;
  productCategoryId?: number;
  image?: string;
  name?: string;
  unit?: string;
  tag?: [string];
  galleries?: [string];
}
