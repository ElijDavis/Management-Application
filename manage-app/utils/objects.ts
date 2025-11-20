type NameProps = {
  name: string;
};

type ModalProps = {
  modal: NameProps['name'];
  auth?: Auth
}

const enum Auth {
  OTP,
  LogIn,
  SignUp
}

type UserCredentials = {
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