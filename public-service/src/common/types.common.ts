export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER_NON_BINARY = 'other_non_binary',
  NOT_DISCLOSED = 'not_disclosed',
}

export type UserAccessToken = { access_token: string };

export interface ClassConstructor<T> {
  new (...args: any[]): T;
}
