// app/api/cookies/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// POST method
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { token } = body;

		if (!token) {
			return NextResponse.json({ error: 'Missing token' }, { status: 400 });
		}

		const base64Payload = token.split('.')[1];
		const decodedJson = Buffer.from(base64Payload, 'base64').toString();
		const decodedToken = JSON.parse(decodedJson);
		console.log('Decoded Token:', decodedToken);

		const response = NextResponse.json({ message: 'Cookie set successfully!' });
		response.cookies.set('decodedToken', JSON.stringify(decodedToken), {
			httpOnly: false,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24,
			path: '/',
			sameSite: 'lax',
		});

		return response;

	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to process the token.' }, { status: 500 });
	}
}

// GET method (optional)
export async function GET() {
	const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('decodedToken');

    if (!tokenCookie) {
        return new Response(JSON.stringify({ error: 'No decodedToken cookie found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let decodedToken;
    try {
        decodedToken = JSON.parse(tokenCookie.value);
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid cookie value' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(decodedToken), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
