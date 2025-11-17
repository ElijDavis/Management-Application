type navTabs = {
  name: string;
};

type user = {
  email: string;
  password: string;
  phone?: number;
};

const enum AuthType {
  EMAIL,
  PHONE,
  OTP_EMAIL,
  OTP_PHONE
}