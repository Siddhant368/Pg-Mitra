import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

let failed = false;
function assert(name, condition, expected, got, body) {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    console.log(`FAIL ${name} (expected ${expected}, got ${got}) ${body ? JSON.stringify(body) : ''}`);
    failed = true;
  }
}

async function request(path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = text;
  }
  return { status: res.status, headers: res.headers, body: json };
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function signupUser() {
  const email = `test_${Date.now()}_${Math.random()}@example.com`;
  let res;
  while (true) {
    res = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email, password: 'Test@1234x' }),
    });
    if (res.status === 429) {
      console.log('429 Too Many Requests - waiting 10 seconds. You may want to wait one minute or raise the throttle in development.');
      await sleep(10000);
      continue;
    }
    break;
  }
  const cookie = res.headers.get('set-cookie')?.split(';')[0];
  return { email, cookie, status: res.status, body: res.body };
}

async function run() {
  // 2. Sign up A and B
  const userA = await signupUser();
  assert('User A signup', userA.status === 201, 201, userA.status, userA.body);
  
  await sleep(1000); // Small delay
  const userB = await signupUser();
  assert('User B signup', userB.status === 201, 201, userB.status, userB.body);

  const authA = { Cookie: userA.cookie };
  const authB = { Cookie: userB.cookie };

  // 3. User A PG
  let res = await request('/pgs', { method: 'POST', headers: authA, body: JSON.stringify({ name: 'Alpha PG', address: '123 St', city: 'City' }) });
  assert('Create PG', res.status === 201, 201, res.status, res.body);
  const pgId = res.body.id;

  res = await request('/pgs', { method: 'POST', headers: authA, body: JSON.stringify({ name: 'ALPHA pg', address: '456 St', city: 'City' }) });
  assert('Create duplicate PG name', res.status === 409, 409, res.status, res.body);

  res = await request('/pgs', { headers: authA });
  assert('List PGs', res.status === 200 && Array.isArray(res.body) && res.body.length === 1, '200 and length 1', res.status, res.body);

  res = await request(`/pgs/${pgId}`, { headers: authA });
  assert('Get PG', res.status === 200 && res.body.id === pgId, '200 and matching id', res.status, res.body);

  res = await request(`/pgs/${pgId}`, { method: 'PATCH', headers: authA, body: JSON.stringify({ city: 'New City' }) });
  assert('Patch PG', res.status === 200 && res.body.city === 'New City', '200 and city New City', res.status, res.body);

  // 4. User A Rooms
  res = await request(`/pgs/${pgId}/rooms`, { method: 'POST', headers: authA, body: JSON.stringify({ roomNumber: '101', floor: 1, sharing: 3, rentPerBed: 6000 }) });
  assert('Create room 101', res.status === 201 && res.body.totalBeds === 3, '201 and 3 beds', res.status, res.body);
  const room101Id = res.body.id;

  res = await request(`/pgs/${pgId}/rooms`, { method: 'POST', headers: authA, body: JSON.stringify({ roomNumber: '101', floor: 1, sharing: 2, rentPerBed: 5000 }) });
  assert('Create duplicate room 101', res.status === 409, 409, res.status, res.body);

  res = await request(`/pgs/${pgId}/rooms`, { method: 'POST', headers: authA, body: JSON.stringify({ roomNumber: '102', floor: 1, sharing: 2, rentPerBed: 5000 }) });
  assert('Create room 102', res.status === 201, 201, res.status, res.body);
  const room102Id = res.body.id;

  res = await request(`/pgs/${pgId}/rooms`, { headers: authA });
  assert('List rooms', res.status === 200 && res.body.length === 2 && res.body.reduce((acc, r) => acc + r.totalBeds, 0) === 5, '200, 2 rooms, 5 beds total', res.status, res.body);

  res = await request(`/pgs/${pgId}/summary`, { headers: authA });
  const sum = res.body;
  assert('PG summary', res.status === 200 && sum.totalBeds === 5 && sum.vacantBeds === 5 && Array.isArray(sum.vacantBySharing), '200 and correct stats', res.status, sum);

  // 5. User A Patch Room
  res = await request(`/rooms/${room101Id}`, { method: 'PATCH', headers: authA, body: JSON.stringify({ sharing: 4 }) });
  assert('Patch room sharing 4', res.status === 200 && res.body.totalBeds === 4, '200 and 4 beds', res.status, res.body);

  res = await request(`/rooms/${room101Id}`, { method: 'PATCH', headers: authA, body: JSON.stringify({ sharing: 3 }) });
  assert('Patch room sharing 3', res.status === 200 && res.body.totalBeds === 3, '200 and 3 beds', res.status, res.body);

  res = await request(`/pgs/${pgId}`, { method: 'DELETE', headers: authA });
  assert('Delete PG with rooms', res.status === 400, 400, res.status, res.body);

  // 6. User B unauthorized access
  res = await request(`/pgs/${pgId}`, { headers: authB });
  assert('User B GET PG', res.status === 404, 404, res.status, res.body);

  res = await request(`/pgs/${pgId}`, { method: 'PATCH', headers: authB, body: JSON.stringify({ city: 'B City' }) });
  assert('User B PATCH PG', res.status === 404, 404, res.status, res.body);

  res = await request(`/pgs/${pgId}`, { method: 'DELETE', headers: authB });
  assert('User B DELETE PG', res.status === 404, 404, res.status, res.body);

  res = await request(`/rooms/${room101Id}`, { headers: authB });
  assert('User B GET Room', res.status === 404, 404, res.status, res.body);

  res = await request(`/pgs`, { headers: authB });
  assert('User B List PGs', res.status === 200 && Array.isArray(res.body) && res.body.length === 0, '200 and empty', res.status, res.body);

  // 7. Invalid id and unauth
  res = await request(`/pgs/invalid123`, { headers: authA });
  assert('Invalid ID format', res.status === 400, 400, res.status, res.body);

  res = await request(`/pgs`);
  assert('Without cookie', res.status === 401, 401, res.status, res.body);

  // 8. Cleanup
  res = await request(`/rooms/${room101Id}`, { method: 'DELETE', headers: authA });
  assert('Delete room 101', res.status === 200, 200, res.status, res.body);

  res = await request(`/rooms/${room102Id}`, { method: 'DELETE', headers: authA });
  assert('Delete room 102', res.status === 200, 200, res.status, res.body);

  res = await request(`/pgs/${pgId}`, { method: 'DELETE', headers: authA });
  assert('Delete PG', res.status === 200, 200, res.status, res.body);

  res = await request(`/pgs`, { headers: authA });
  assert('List PGs after delete', res.status === 200 && res.body.length === 0, '200 and empty', res.status, res.body);

  if (failed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
