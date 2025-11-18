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

type User = {
  email: string;
  password: string;
  phone?: number;
  active?: boolean; //indicates if user is logged in
};

const enum AuthType {
  EMAIL,
  PHONE,
  OTP_EMAIL,
  OTP_PHONE
}