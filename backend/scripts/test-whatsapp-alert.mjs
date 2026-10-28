const phone = (process.env.ALERT_WHATSAPP_NUMBER || '').trim();
const apikey = (process.env.CALLMEBOT_API_KEY || '').trim();

if (!phone || !apikey) {
  console.log('FAILED missing environment variables');
  process.exit(1);
}

const lines = [
  'New demo request on PGMitra',
  'Name: Test Owner',
  'Phone: 9876543210',
  'PG: Test PG',
  'City: Jaipur',
  'Beds: 40',
  'Preferred day: Tue, 13 Oct 2026',
  'Best time to call: Evening',
  'Chat: https://wa.me/919876543210',
];

const text = lines.join('\n');

const params = new URLSearchParams({
  phone,
  text,
  apikey,
});

const url = new URL('https://api.callmebot.com/whatsapp.php');
url.search = params.toString();

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000);

try {
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timer);
  if (!res.ok) {
    console.log(`FAILED HTTP ${res.status}`);
    process.exit(1);
  }
  const body = await res.text();
  if (/error|invalid|fail/i.test(body)) {
    console.log('FAILED CallMeBot error');
    process.exit(1);
  }
  console.log('SENT');
} catch (err) {
  clearTimeout(timer);
  if (err.name === 'AbortError') {
    console.log('FAILED timeout');
  } else {
    console.log('FAILED network error');
  }
  process.exit(1);
}
