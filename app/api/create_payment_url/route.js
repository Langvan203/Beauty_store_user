// app/api/create_payment_url/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";
import dateFormat from "dateformat";

export async function POST(request) {
  try {
    // Set timezone to match VNPAY's requirements
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    const body = await request.json();
    const { amount, bankCode, orderDescription, orderType, language, id } = body;
    const orderIdParam = id || "success";
    
    const ipAddr = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    const tmnCode = "Z435GS91";
    const secretKey = "7T5VE6QAI5DYZTA5JFDZD0LGZES19KG3";
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = `http://localhost:3000/api/vnpay_return`;

    const date = new Date();
    const createDate = dateFormat(date, "yyyymmddHHMMss");
    const orderId = dateFormat(date, "HHMMss");

    // Ensure amount is a number
    const amountNumber = Number(amount);
    
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: language || "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: orderType || "other",
      vnp_Amount: Math.round(amountNumber * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    // Use the exact same sortObject function as the original code
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

    vnp_Params = sortObject(vnp_Params);

    // Create signature exactly as in original code
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    // Use Buffer.from instead of new Buffer (deprecated)
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    
    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("Error in create_payment_url API", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}