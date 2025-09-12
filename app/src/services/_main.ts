export async function requestData(
    url: string, 
    method: string, 
    headers?: Record<any, any>, 
    body?: Record<any, any>
) {
    console.log('Endpoint:', url);
    console.log('Method:', method);
    console.log('Headers:', headers);
    console.log('Body', body);
    
    const res = await fetch(url, {
        method: method,
        headers: headers ?? { "Content-Type": "application/json"},
        body: body && JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error || 'Something went wrong.');
    }

    return await res.json()
}