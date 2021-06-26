export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  channels: DiscordChannel[];
}

export interface DiscordChannel {
  id: string;
  name: string;
  currentUsers: TeamPlayer[];
}

export interface TeamPlayer {
  id: string;
  name: string;
  picture: string;
  isIgnored?: boolean;
  isPlaceholder?: boolean;
}

export interface MoveModel {
  guildId: string;
  channels: MoveChannel[];
}

export interface MoveChannel {
  id: string;
  users: string[];
}
