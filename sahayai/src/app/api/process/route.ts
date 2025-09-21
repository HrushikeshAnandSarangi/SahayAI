import { NextRequest, NextResponse } from 'next/server';

// It's good practice to have the backend URL as an environment variable
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';

export async function POST(request: NextRequest) {
  try {
    // The incoming request from the Next.js client contains the FormData
    const formData = await request.formData();
    
    // Forward the FormData directly to the Flask backend
    const flaskResponse = await fetch(`${FLASK_API_URL}/process-document`, {
      method: 'POST',
      body: formData,
      // The 'Content-Type' header will be set automatically by fetch for FormData
    });

    // Check if the backend responded successfully
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      // Return a descriptive error to the client
      return NextResponse.json(
        { error: errorData.error || 'Failed to process document in backend' },
        { status: flaskResponse.status }
      );
    }

    // Parse the JSON response from the backend
    const data = await flaskResponse.json();
    
    // Send the successful response back to the Next.js client
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in Next.js API route (/api/process):', error);
    // Return a generic internal server error
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
