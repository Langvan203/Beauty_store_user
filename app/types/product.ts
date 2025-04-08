// /types/product.ts
export interface ProductImage {
  imageID: number;
  imageUrl: string;
  productID: number;
  is_primary: number;
  createdDate: string;
  updatedDate: string | null;
}

export interface Product {
  productID: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  ingredient: string;
  userManual: string;
  productDiscount: number;
  categoryID: number;
  brandID: number;
  productImages: ProductImage[];
  variants: variants[];
  createdDate: string;
  updatedDate: string | null;
}
export interface ProductDetails {
  productID: number;
  productName: string;
  categoryName: string;
  brandName: string;
  categoryId: number;
  brandId: number;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productDiscount: number;
  productImages: ProductImage[];
  createdDate: string;
  updatedDate: string | null;
  variants: variants[];
}

export interface ProductPage {
  productID: number;
  productName: string;
  categoryName: string;
  brandName: string;
  categoryId: number;
  brandId: number;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productDiscount: number;
  productImages: string;
  variants: variants[];
}
export interface variants {
  variantId: number;
  variantName: string;
  price: number;
  stock: number;
}
export interface ProductPagnation {
  listProducts: ProductDetails[],
  totalItem: number;
  totalPages: number;
  page:number;
  pageSize: number
}
export interface ApiResponse {
  status: number;
  errorCode: number;
  code: string;
  data: Product[];
  des: string;
}
