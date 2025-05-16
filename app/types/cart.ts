export interface CartItem {
  cart_ItemID: number;
  productID: number;
  productName: string;
  productImage: string;
  quantity: number;
  discount: number;
  price: number;
  subTotal: number;
  variant: number;
  colorName: string;
  colorCode: string;
}

export interface Cart {
  cartID: number;
  userID: number;
  items: CartItem[];
  totalPrice: number;
}

export interface AddToCartDto {
  productID: number;
  quantity: number;
  variantID: number;
  colorID: number;
}

export interface CheckOutDto {
  shippingAdress: string,
  phoneNumber: string,
  receiverName: string,
  paymentMethod: string,
  shippingMethod: string,
}
