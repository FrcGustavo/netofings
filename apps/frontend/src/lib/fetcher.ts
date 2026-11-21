type RequestOptions = RequestInit & {
  baseUrl?: string
}

export class HttpError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text.length > 0 ? text : null
}

export async function fetchJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { baseUrl = '', headers, ...rest } = options
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`

  const response = await fetch(url, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new HttpError(`Request failed with status ${response.status}`, response.status, body)
  }

  return body as T
}
