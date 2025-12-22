export async function requestData(
    url: string, 
    method: string, 
    headers?: Record<any, any>, 
    body?: any
) {
    // console.log('Endpoint:', url);
    // console.log('Method:', method);
    // console.log('Headers:', headers);
    // console.log('Body', body);
    
    const res = await fetch(url, {
        method: method,
        headers: headers ?? { "Content-Type": "application/json"},
        body: body && JSON.stringify(body),
    });

    const response = await res.json();

    if (!res.ok) {
        throw new Error(response.message || response.error || 'Something went wrong.');
    }

    console.log('Response Body:', response);
    
    return await response;
}

export async function requestFormData(
  url: string,
  method: string,
  headers?: Record<string, string>,
  body?: any // can be FormData | object | string | undefined
) {
  console.log('Endpoint:', url);
  console.log('Method:', method);
  console.log('Headers (in):', headers);
  console.log('Body (in):', body);

  const init: RequestInit = { method };

  // Decide how to send the body
  if (method !== 'GET' && method !== 'HEAD') {
    if (body instanceof FormData) {
      init.body = body;                // let the browser set multipart/form-data boundary
      init.headers = headers;          // don't touch Content-Type
    } else if (body !== undefined && body !== null && typeof body === 'object') {
      init.body = JSON.stringify(body); // JSON for plain objects
      init.headers = { ...(headers || {}), 'Content-Type': 'application/json' };
    } else if (typeof body === 'string') {
      init.body = body;                 // raw string (set headers yourself if needed)
      init.headers = headers;
    } else {
      init.headers = headers;
    }
  } else {
    init.headers = headers;
  }

  const res = await fetch(url, init);

  // Try to parse JSON if present
  const ct = res.headers.get('content-type') || '';
  let payload: any = null;
  if (ct.includes('application/json')) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  } else if (res.status !== 204) {
    // Fallback to text for non-JSON responses
    try {
      payload = await res.text();
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const msg =
      (payload && (payload.message || payload.error)) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  console.log('Response Body:', payload);
  return payload;
}
