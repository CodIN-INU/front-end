import axios from 'axios';

/** `\"`가 여러 겹 쌓인 Feign/게이트웨이 문자열을 풀어 JSON으로 읽을 수 있게 한다. */
function collapseEscapedQuotes(s: string, maxPass = 20): string {
  let cur = s;
  for (let i = 0; i < maxPass; i++) {
    const next = cur.replace(/\\"/g, '"');
    if (next === cur) break;
    cur = next;
  }
  return cur;
}

function tryParseJsonPayload(candidate: string): string | null {
  try {
    const parsed: unknown = JSON.parse(candidate);
    if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'object' && parsed[0] !== null) {
      const msg = (parsed[0] as { message?: unknown }).message;
      if (typeof msg === 'string' && msg.length > 0) return msg;
    }
    if (parsed && typeof parsed === 'object' && parsed !== null) {
      const msg = (parsed as { message?: unknown }).message;
      if (typeof msg === 'string' && msg.length > 0) return msg;
    }
  } catch {
    /* try next */
  }
  return null;
}

/** Feign 본문 끝의 `[{...}]`만 잘라낸다. `]` 뒤에 `\"}` 가 붙어도 parse 가능하게. */
function sliceTrailingJsonArray(s: string): string | null {
  const feign = s.lastIndexOf(']: [');
  const start = feign !== -1 ? feign + 3 : s.lastIndexOf('[');
  if (start === -1) return null;
  const end = s.lastIndexOf(']');
  if (end <= start) return null;
  return s.slice(start, end + 1);
}

/** Spring BindingResult / 검증 예외 본문의 `default message [...]` 구간을 모아 사용자 문구로 만든다. */
function extractSpringDefaultMessages(text: string): string | null {
  const re = /default message \[([^\]]+)\]/g;
  const parts: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const p = m[1].trim();
    if (p.length > 0) parts.push(p);
  }
  if (parts.length === 0) return null;
  return parts.join(' · ');
}

function parseMessageFromJsonishString(raw: string): string | null {
  const t = raw.trim();

  const candidates: string[] = [t];
  const bracketOnly = sliceTrailingJsonArray(t);
  if (bracketOnly) {
    candidates.push(bracketOnly);
  }

  const collapsed = collapseEscapedQuotes(t);
  if (collapsed !== t) {
    candidates.push(collapsed);
    const collapsedArray = sliceTrailingJsonArray(collapsed);
    if (collapsedArray) {
      candidates.push(collapsedArray);
    }
  }

  const tryAll = (list: string[]) => {
    for (const candidate of list) {
      const fromJson = tryParseJsonPayload(candidate);
      if (fromJson) return fromJson;
    }
    for (const candidate of list) {
      const fromJson = tryParseJsonPayload(collapseEscapedQuotes(candidate));
      if (fromJson) return fromJson;
    }
    return null;
  };

  const direct = tryAll(candidates);
  if (direct) return direct;

  const quoted = t.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (quoted?.[1]) return quoted[1].replace(/\\"/g, '"');

  const spring = extractSpringDefaultMessages(t);
  if (spring) return spring;

  return null;
}

function messageFromResponseData(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.length > 0) {
      const extracted = parseMessageFromJsonishString(msg);
      return extracted ?? msg;
    }
  }
  if (typeof data === 'string') {
    return parseMessageFromJsonishString(data);
  }
  return null;
}

/**
 * Axios / 게이트웨이 에러에서 사용자에게 보여줄 짧은 메시지를 뽑는다.
 * response.data가 객체가 아니거나, 본문이 Feign 스타일 긴 문자열인 경우도 처리한다.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const fromData = messageFromResponseData(err.response?.data);
    if (fromData) return fromData;
    if (typeof err.message === 'string') {
      const fromLongMessage = parseMessageFromJsonishString(err.message);
      if (fromLongMessage) return fromLongMessage;
    }
    return fallback;
  }
  if (err instanceof Error) {
    const fromMsg = parseMessageFromJsonishString(err.message);
    if (fromMsg) return fromMsg;
    return err.message || fallback;
  }
  /** `fetchClient` 등이 던지는 `{ status, message, code }` 형태 */
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    const msg = (err as { message: string }).message;
    const extracted = parseMessageFromJsonishString(msg);
    if (extracted) return extracted;
    if (msg.trim().length > 0) return msg;
  }
  return fallback;
}
