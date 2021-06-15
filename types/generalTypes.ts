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
