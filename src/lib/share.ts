import { formModelSchema, FormModel } from './schema';

function toUrlSafeBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromUrlSafeBase64(urlSafe: string): string {
  let b64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad) b64 += '='.repeat(4 - pad);
  return b64;
}

export function encodeFormModel(model: FormModel): string {
  const json = JSON.stringify(model);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 = btoa(binary);
  return toUrlSafeBase64(base64);
}

export function decodeFormModel(payload: string): { success: boolean; data?: FormModel; error?: unknown } {
  try {
    const base64 = fromUrlSafeBase64(payload);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    const res = formModelSchema.safeParse(parsed);
    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true, data: res.data };
  } catch (e) {
    return { success: false, error: e };
  }
}