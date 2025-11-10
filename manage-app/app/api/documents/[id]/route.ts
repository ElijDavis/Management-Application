// app/api/documents/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Auth route placeholder' });
}
