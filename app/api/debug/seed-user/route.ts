import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email || 'dev@local';
    const password = body.password || 'devpass';
    const full_name = body.full_name || 'Dev User';
    const role_name = body.role_name || 'Admin';

    // Ensure role exists
    const role = await db.roles.upsert({
      where: { role_name },
      update: {},
      create: { role_name },
    });

    const hashed = await bcrypt.hash(password, 10);

    // Upsert user by email
    const user = await db.users.upsert({
      where: { email },
      update: {
        full_name,
        password: hashed,
        role_id: role.role_id,
      },
      create: {
        full_name,
        email,
        password: hashed,
        role_id: role.role_id,
      },
    });

    return NextResponse.json({ success: true, user: { user_id: user.user_id, email: user.email, full_name: user.full_name } });
  } catch (error) {
    console.error('SEED_USER_ERROR:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
