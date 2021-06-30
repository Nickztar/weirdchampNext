import crypto from 'crypto';

export function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  return crypto.createHash('sha256').update(msgBuffer).digest('hex');
}
