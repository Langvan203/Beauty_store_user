// pages/api/create_payment_url.js
import crypto from 'crypto';
import qs from 'qs';
import dateFormat from 'dateformat';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Lấy địa chỉ IP khách hàng
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  // Lấy các cấu hình từ biến môi trường hoặc file config
  const tmnCode   = 'Z435GS91';
  const secretKey = 'ITNW6IU6EYNVJCU1J32K2WDD3MRHRQ15';
  const vnpUrl    = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = 'http://localhost:3000/cart'; //
  
  // Thông tin đơn hàng
  const { amount, bankCode, orderDescription, orderType, language } = req.body;
  const locale = language || 'vn';
  
  // Tạo ngày giờ và mã đơn hàng
  const date = new Date();
  const createDate = dateFormat(date, 'yyyymmddHHMMss');
  const orderId = dateFormat(date, 'HHMMss');
  
  // Chuẩn bị tham số theo yêu cầu của VNPAY
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDescription,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100, // chuyển đổi số tiền (theo yêu cầu của VNPAY)
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };
  
  // Nếu có bankCode thì thêm tham số
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }
  
  // Hàm sắp xếp đối tượng theo thứ tự tăng dần của key
  const sortObject = (obj) => {
    let sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }
  
  vnp_Params = sortObject(vnp_Params);
  
  // Tạo chuỗi query để ký
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  
  // Thêm chữ ký vào tham số
  vnp_Params['vnp_SecureHash'] = signed;
  
  // Tạo URL thanh toán hoàn chỉnh
  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;
  
  // Trả về URL cho frontend hoặc chuyển hướng ngay
  // Nếu bạn muốn chuyển hướng ngay, có thể dùng res.redirect(paymentUrl)
  res.status(200).json({ paymentUrl });
}
