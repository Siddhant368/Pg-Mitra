const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const tomorrow = new Date(Date.now() + 86400000);
const validDate = formatter.format(tomorrow);

const yesterday = new Date(Date.now() - 86400000);
const pastDate = formatter.format(yesterday);

const thirtyDays = new Date(Date.now() + 30 * 86400000);
const futureDate = formatter.format(thirtyDays);

async function requestWithThrottleRetry(url, options = {}) {
  let attempts = 0;
  while (attempts < 6) {
    attempts++;
    const res = await fetch(url, options);
    if (res.status === 429) {
      const retryAfterHeader = res.headers.get('retry-after');
      const waitSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 21;
      console.log(`Hint: Hit throttle rate limit (3 requests per minute allowed on /demo-requests). Waiting ${waitSec}s before retry...`);
      await new Promise((resolve) => setTimeout(resolve, Math.max(waitSec, 1) * 1000));
      continue;
    }
    return res;
  }
  return fetch(url, options);
}

let failed = false;

async function runSmokeTests() {
  // 1. Valid request
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test User',
        email: 'smoke-test@example.com',
        phone: '9876543210',
        pgName: 'Smoke PG',
        city: 'Jaipur',
        approxBeds: 25,
        preferredDate: validDate,
        preferredTime: 'MORNING',
        message: 'Smoke test demo request message',
      }),
    });
    const data = await res.json().catch(() => ({}));
    const isStatusOk = res.status === 200 || res.status === 201;
    const isOnlyMessage = Object.keys(data).length === 1 && typeof data.message === 'string';

    if (isStatusOk && isOnlyMessage) {
      console.log('PASS valid request');
    } else {
      console.log(`FAIL valid request (expected 200 or 201 with only message field, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL valid request (expected 200 or 201, got network error: ${err.message})`);
    failed = true;
  }

  // 2. Invalid phone
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test User',
        phone: '12345',
        preferredDate: validDate,
        preferredTime: 'MORNING',
      }),
    });
    if (res.status === 400) {
      console.log('PASS invalid phone');
    } else {
      console.log(`FAIL invalid phone (expected 400, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL invalid phone (expected 400, got network error: ${err.message})`);
    failed = true;
  }

  // 3. Date in the past
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test User',
        phone: '9876543210',
        preferredDate: pastDate,
        preferredTime: 'MORNING',
      }),
    });
    if (res.status === 400) {
      console.log('PASS date in the past');
    } else {
      console.log(`FAIL date in the past (expected 400, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL date in the past (expected 400, got network error: ${err.message})`);
    failed = true;
  }

  // 4. Date 30 days ahead
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test User',
        phone: '9876543210',
        preferredDate: futureDate,
        preferredTime: 'MORNING',
      }),
    });
    if (res.status === 400) {
      console.log('PASS date 30 days ahead');
    } else {
      console.log(`FAIL date 30 days ahead (expected 400, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL date 30 days ahead (expected 400, got network error: ${err.message})`);
    failed = true;
  }

  // 5. Filled honeypot
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spambot@example.com',
        phone: '9876543210',
        preferredDate: validDate,
        preferredTime: 'MORNING',
        website: 'https://spam.example.com',
      }),
    });
    if (res.status === 200) {
      console.log('PASS filled honeypot');
    } else {
      console.log(`FAIL filled honeypot (expected 200, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL filled honeypot (expected 200, got network error: ${err.message})`);
    failed = true;
  }

  // 6. Invalid email
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test User',
        email: 'not-an-email',
        phone: '9876543210',
        preferredDate: validDate,
        preferredTime: 'MORNING',
      }),
    });
    if (res.status === 400) {
      console.log('PASS invalid email');
    } else {
      console.log(`FAIL invalid email (expected 400, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL invalid email (expected 400, got network error: ${err.message})`);
    failed = true;
  }

  // 7. Missing email
  try {
    const res = await requestWithThrottleRetry(`${BASE_URL}/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test User',
        phone: '9876543210',
        preferredDate: validDate,
        preferredTime: 'MORNING',
      }),
    });
    if (res.status === 400) {
      console.log('PASS missing email');
    } else {
      console.log(`FAIL missing email (expected 400, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL missing email (expected 400, got network error: ${err.message})`);
    failed = true;
  }

  // 8. GET /demo-requests without a cookie
  try {
    const res = await fetch(`${BASE_URL}/demo-requests`, {
      method: 'GET',
    });
    if (res.status === 401) {
      console.log('PASS unauthorized GET');
    } else {
      console.log(`FAIL unauthorized GET (expected 401, got ${res.status})`);
      failed = true;
    }
  } catch (err) {
    console.log(`FAIL unauthorized GET (expected 401, got network error: ${err.message})`);
    failed = true;
  }

  if (failed) {
    process.exit(1);
  }
}

runSmokeTests();
