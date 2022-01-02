export enum SocialEnum {
  LINKED_IN = 'likedin',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  TELEGRAM = 'telegram',
}

export interface IAvatar {
  id: number;
  name: string;
  url: string;
  icon: any;
}
