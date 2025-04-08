// app/api/vnpay_return/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const vnp_Params = {};
    
    // Lấy tất cả tham số từ URL
    url.searchParams.forEach((value, key) => {
      vnp_Params[key] = value;
    });
    
    const secureHash = vnp_Params['vnp_SecureHash'];
    
    // Lấy orderId đã được gửi trong returnUrl
    const originalOrderId = vnp_Params['vnp_OrderInfo']?.split(':')[1]?.trim() || 'unknown';
    
    // Xóa hash để tạo lại chữ ký
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    
    // Sắp xếp object
    function sortObject(obj) {
      let sorted = {};
      let str = [];
      let key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          str.push(encodeURIComponent(key));
        }
      }
      str.sort();
      for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
      }
      return sorted;
    }
    
    const sortedParams = sortObject(vnp_Params);
    
    // Kiểm tra chữ ký
    const secretKey = "7T5VE6QAI5DYZTA5JFDZD0LGZES19KG3";
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    // Tạo URL redirect với toàn bộ thông tin
    const redirectUrl = new URL(`http://localhost:3000/checkout/${originalOrderId}`);
    
    // Thêm các tham số vào URL
    Object.entries(vnp_Params).forEach(([key, value]) => {
      redirectUrl.searchParams.append(key, value);
    });
    
    // Thêm thông tin xác thực chữ ký
    redirectUrl.searchParams.append('signature_valid', secureHash === signed ? 'true' : 'false');
    
    // Redirect về trang checkout/id với đầy đủ thông tin
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in vnpay_return API", error);
    return NextResponse.redirect(new URL('/checkout/error?reason=server-error', request.url));
  }
}