export interface Payment {
    paymentMethodID: number;
    paymentType: number;
    paymentName: string;
    cardNumber: string;
    outerDateUsing: string;
    cvv: string;
}