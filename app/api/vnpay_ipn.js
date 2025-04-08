// pages/api/vnpay_ipn.js
import crypto from 'crypto';
import qs from 'qs';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  let vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  
  // Loại bỏ các tham số liên quan tới chữ ký
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  
  // Hàm sắp xếp lại các tham số
  const sortObject = (obj) => {
    let sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }
  
  vnp_Params = sortObject(vnp_Params);
  
  // Tạo chuỗi ký
  const signData = qs.stringify(vnp_Params, { encode: false });
  const secretKey = process.env.VNP_HASHSECRET;
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  
  if (secureHash === signed) {
    // Xác thực thành công, xử lý đơn hàng (update trạng thái, lưu dữ liệu, …)
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    // Ví dụ: nếu rspCode là '00' thì thanh toán thành công
    if (rspCode === '00') {
      // Cập nhật đơn hàng thành công vào CSDL
      console.log(`Đơn hàng ${orderId} thanh toán thành công.`);
    } else {
      console.log(`Đơn hàng ${orderId} thất bại, ResponseCode: ${rspCode}`);
    }
    // Trả về kết quả cho VNPAY theo định dạng yêu cầu
    return res.status(200).json({ RspCode: '00', Message: 'success' });
  } else {
    return res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
  }
}
