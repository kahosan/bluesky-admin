export interface FlexUser {
  scope: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
}

export interface FlexUserResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface CompanyUser {
  username: string;
  password: string;
}

export interface CompanyUserResponse {
  msg: string;
}
