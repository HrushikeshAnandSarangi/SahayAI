import { NextRequest, NextResponse } from 'next/server';

const FLASK_API_URL = process.env.FLASK_API_URL || 'https://sahayai-backend-23401246568.europe-west1.run.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.question || !body.document_id || !body.user_role) {
      return NextResponse.json(
        { error: 'Invalid request body. "question", "document_id", and "user_role" are required.' },
        { status: 400 },
      );
    }
    const flaskResponse = await fetch(`${FLASK_API_URL}/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const data = await flaskResponse.json();
    return NextResponse.json(data, { status: flaskResponse.status });
  } catch (error) {
    console.error('Error in Next.js API route (/api/chat):', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
