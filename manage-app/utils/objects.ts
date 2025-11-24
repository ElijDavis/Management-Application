type NameProps = {
  name: string;
};

type UserCredentials = {
  email: string;
  password: string;
  phone?: number;
};

type ToastProps = {
  message: string
  onClose: () => void
  duration?: number // in milliseconds
}

type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const enum AuthType {
  EMAIL,
  PHONE,
  OTP_EMAIL,
  OTP_PHONE
}