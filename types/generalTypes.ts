export interface DiscordUser {
  _id: string;
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  email: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
}

export interface IPreviewSound {
  url: string;
}

export interface IOnDrag {
  x: number;
  y: number;
}

export interface S3Fields {
  /**
   * A base64-encoded policy detailing what constitutes an acceptable POST
   * upload. Composed of the conditions and expiration provided to
   * s3.createPresignedPost
   */
  Policy: string;

  /**
   * A hex-encoded HMAC of the POST policy, signed with the credentials
   * provided to the S3 client.
   */
  'X-Amz-Signature': string;

  /**
   * Additional keys that must be included in the form to be submitted. This
   * will include signature metadata as well as any fields provided to
   * s3.createPresignedPost
   */
  [key: string]: string;
}
