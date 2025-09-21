import { NextRequest, NextResponse } from 'next/server';

// Reuse the backend URL environment variable
const FLASK_API_URL = process.env.FLASK_API_URL || 'https://sahayai-backend-23401246568.europe-west1.run.app';

export async function POST(request: NextRequest) {
  try {
    // The incoming request from the Next.js client contains the chat JSON data
    const body = await request.json();

    // Validate that the required fields are present
    if (!body.question || !body.context || !body.user_role) {
      return NextResponse.json(
        { error: 'Invalid request body. "question", "context", and "user_role" are required.' },
        { status: 400 }
      );
    }

    // Forward the JSON data to the Flask backend
    const flaskResponse = await fetch(`${FLASK_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Check if the backend responded successfully
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Backend failed to respond to chat message' },
        { status: flaskResponse.status }
      );
    }

    // Parse the JSON response from the backend
    const data = await flaskResponse.json();

    // Send the successful response back to the Next.js client
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in Next.js API route (/api/chat):', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
