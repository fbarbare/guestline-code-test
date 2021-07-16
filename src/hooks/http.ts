import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';
import { getErrorMessages } from '../types/types';

export class HttpError extends Error {
  public readonly status: number;
  public readonly responseText: string;

  constructor(message: string, status: number = 500, responseText: string = '') {
    super(message);
    this.status = status;
    this.responseText = responseText;
  }
}

export interface HttpRequest {
  readonly body?: BodyInit | null;
  readonly cache?: RequestCache;
  readonly credentials?: RequestCredentials;
  readonly headers?: Record<string, string>;
  readonly integrity?: string;
  readonly keepalive?: boolean;
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly mode?: RequestMode;
  readonly redirect?: RequestRedirect;
  readonly referrer?: string;
  readonly referrerPolicy?: ReferrerPolicy;
  readonly signal?: AbortSignal | null;
  readonly window?: any;
  readonly url: string;
}

interface PostRequest extends Omit<HttpRequest, 'body'> {
  readonly body?: {};
}

export async function send<a>(
  type: t.Type<a, any, unknown>,
  { url, ...options }: HttpRequest
): Promise<a> {
  let res: Response;
  res = await fetch(url, options);

  if (!res.ok) {
    const responseText = await res.clone().text();
    throw new HttpError(res.statusText, res.status, responseText);
  }

  let data;
  if (type.name !== 'void') {
    data = await res.clone().json();
  }

  const result = type.decode(data);
  if (isLeft(result)) {
    const errorMessages = getErrorMessages(result.left);

    const error = new Error(`Invalid data returned from ${url}: ${errorMessages.join('\n')}`);
    console.error(error);

    throw error;
  }

  return result.right;
}

export async function get<a>(
  type: t.Type<a, any, unknown>,
  request: Omit<HttpRequest, 'method'>
): Promise<a> {
  return send(type, {
    ...request,
    method: 'GET'
  });
}

export async function post<a>(
  type: t.Type<a, any, unknown>,
  request: Omit<PostRequest, 'method'>
): Promise<a> {
  return send(type, {
    ...request,
    body: request.body ? JSON.stringify(request.body) : undefined,
    method: 'POST'
  });
}

export async function update<a>(
  type: t.Type<a, any, unknown>,
  request: Omit<PostRequest, 'method'>
): Promise<a> {
  return send(type, {
    ...request,
    body: request.body ? JSON.stringify(request.body) : undefined,
    method: 'PUT'
  });
}

export async function patch<a>(
  type: t.Type<a, any, unknown>,
  request: Omit<PostRequest, 'method'>
): Promise<a> {
  return send(type, {
    ...request,
    body: request.body ? JSON.stringify(request.body) : undefined,
    method: 'PATCH'
  });
}

export async function del<a>(
  type: t.Type<a, any, unknown>,
  request: Omit<HttpRequest, 'method'>
): Promise<a> {
  return send(type, {
    ...request,
    method: 'DELETE'
  });
}
