import { supabase } from "../../lib/supabaseClient";

//Sign up new user
const signUp = async (newUser: user) => {
  if (newUser.email) {
    let {data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
    });
    return {data, error};
  } else if (newUser.phone) {
    let {data, error } = await supabase.auth.signUp({
        phone: newUser.phone.toString(),
        password: newUser.password,
    });
    return {data, error};
  } else {
    throw new Error('Either email or phone number must be provided for sign up.');
  }
}

//Login existing user
const logIn = async (existingUser: user) => {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: existingUser.email,
    password: existingUser.password,
  });
    return {data, error};
}

const OTPLogIn = async (existingUser: user, type: AuthType) => {
  if (type === AuthType.OTP_EMAIL && existingUser.email) {
    let { data, error } = await supabase.auth.signInWithOtp({
      email: existingUser.email,
    });
    return {data, error};
  } else if (type === AuthType.OTP_PHONE && existingUser.phone) {
    let { data, error } = await supabase.auth.signInWithOtp({
      phone: existingUser.phone.toString(),
    });
    return {data, error};
  } else {
    throw new Error('Invalid authentication type or missing contact information for OTP login.');
  }
}

//Get current user
const getCurrentUser = async () => {
  let { data: { user } } = await supabase.auth.getUser();
}

//Password recovery
const recoverPassword = async (email: string) => {
  let { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return {data, error};
}

//Update user
const updateUser = async (updatedInfo: { email?: string; password?: string; }) => {
  let { data, error } = await supabase.auth.updateUser({
    email: updatedInfo.email,
    password: updatedInfo.password,
  });
    return {data, error};
}

//logout user
const logOut = async () => {
  let { error } = await supabase.auth.signOut();
    return { error };
}

//invite user via email
const inviteUser = async (email: string) => {
  let { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
    return {data, error};
}

export {
    signUp,
    logIn,
    OTPLogIn,
    getCurrentUser,
    recoverPassword,
    updateUser,
    logOut,
    inviteUser
}