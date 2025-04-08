export interface OrderItem {
    orderItemID: number;
    productID: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    subTotal: number;
    discount: number;
    variant: string;
    priceOfVariant: number;
  }
  
  export interface Order {
    orderID: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    items: OrderItem[];
  }
  
  export interface CheckoutDto {
    shippingAddress: string;
  }