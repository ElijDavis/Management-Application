import { supabase } from "../../lib/supabaseClient";

//Sign up new user
const signUp = async (newUser: User) => {
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
const logIn = async (existingUser: User) => {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: existingUser.email,
    password: existingUser.password,
  });
    return {data, error};
}

//determine OTP login with email or phone
const OTPLogIn = async (existingUser: User, type: AuthType) => {
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

//Get user from server
const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error("Error fetching user: ", error)
    return null
  }
  return data?.user || null
}

const getCurrentUser = async () => {//Gets the current user (either in session or from server)
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    console.warn("No session found or error:", sessionError)
    return null
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.error("Error fetching user:", userError)
    return null
  }

  return userData.user
}

//Get the local session
const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error("Error fetching user session: ", error)
    return null
  }
  return data?.session || null
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
    inviteUser,
    getSession,
    getUser
}