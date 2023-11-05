export const GET = async <T = any>(
  endpoint: string,
  options?: Omit<RequestInit, "method">,
): Promise<T> => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      ...options?.headers,
    },
    method: "GET",
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw error;
    } catch (e: any) {
      throw { code: response.status, ...e };
    }
  }

  const data: T = await response.json();

  return data;
};

export const POST = async <BodyType = unknown, ReturnType = unknown>(
  endpoint: string,
  body: BodyType,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<ReturnType> => {
  const response = await fetch(endpoint, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw error;
    } catch (e: any) {
      throw { code: response.status, ...e };
    }
  }

  return await response.json();
};

export const PUT = async <BodyType = unknown, ReturnType = unknown>(
  endpoint: string,
  body: BodyType,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<ReturnType> => {
  const response = await fetch(endpoint, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw error;
    } catch (e: any) {
      throw { code: response.status, ...e };
    }
  }

  return await response.json();
};

export const DELETE = async <ReturnType = unknown>(
  endpoint: string,
  options?: Omit<RequestInit, "method">,
): Promise<Response> => {
  const response = await fetch(endpoint, {
    ...options,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw error;
    } catch (e: any) {
      throw { code: response.status, ...e };
    }
  }

  return response;
};
