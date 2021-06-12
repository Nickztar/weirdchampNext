export interface MovieEndpointBodyType {
  id: string;
}
export interface S3File {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: string;
}
export interface PlayEndpointBodyType {
  soundID?: string;
  channelID: string;
}
