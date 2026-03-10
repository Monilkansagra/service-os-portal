import { signToken, verifyToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const sample = {
      user_id: 1,
      email: 'debug@example.com',
      role: 'Admin',
      full_name: 'Debug User',
    };

    const token = await signToken(sample);
    const verified = await verifyToken(token);

    return NextResponse.json({ success: true, token, verified });
  } catch (error) {
    console.error('JWT_DEBUG_ERROR:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
