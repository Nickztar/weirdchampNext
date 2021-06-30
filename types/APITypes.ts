export interface MovieEndpointBodyType {
  id: string;
}
export interface S3File {
  DisplayName: string;
  key: string;
  CreatedBy: string;
  Size: number;
  LastModified?: Date | number;
  NameHash: string;
}
export interface PlayEndpointBodyType {
  soundID?: string;
  channelID: string;
}
