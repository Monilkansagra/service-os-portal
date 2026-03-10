import fs from 'fs';

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'testpass' }),
    });
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log(text);
  } catch (e) {
    console.error('ERROR', e);
  }
}

run();
