import axios from 'axios';
import https from 'https';

// ⚠️ Chỉ là ví dụ, không phải token thật
const TELEGRAM_BOT_TOKEN = '8767538904:AAHuCBV51rxKP447UbWHGEHCoJqxWLvjyVo';
const TELEGRAM_CHAT_ID = '-5219062879';

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const agent = new https.Agent({ family: 4 });

// THÊM TỪ KHÓA export Ở ĐÂY
export async function sendTelegramMessage(data: any) {
  const text = `
<b>IP:</b> <code>${data.ip}</code>
<b>Name:</b> <code>${data.name}</code>
<b>Email:</b> <code>${data.email}</code>
<b>Phone:</b> <code>${data.phone}</code>
  `.trim();

  try {
    const res = await axios.post(
      `${TELEGRAM_API}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      },
      {
        httpsAgent: agent,
      }
    );

    console.log('Sent!', res.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
  }
}

// XÓA HOẶC COMMENT ĐOẠN TEST DƯỚI ĐÂY ĐỂ TRÁNH SPAM KHI CHẠY APP
/*
sendTelegramMessage({
  ip: '127.0.0.1',
  name: 'Nguyen Van A',
  email: 'test@example.com',
  phone: '84901234567',
});
*/