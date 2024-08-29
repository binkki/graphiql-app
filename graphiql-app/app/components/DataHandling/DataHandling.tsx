// export const [email, setEmail] = useState<string>('');
// export const [password, setPassword] = useState<string>('');
// export const [emailError, setEmailError] = useState<string | null>(null);
// export const [passwordError, setPasswordError] = useState<string | null>(null);
// export const [user, setUser] = useState<{
//   email: string;
//   error: string;
//   emailVerified: boolean;
// } | null>(null);

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// export const validatePassword = (auth: unknown, password: string) => {
//   const unicodeRegex = /[\p{L}\p{N}\p{P}\p{S}]/u;
//   const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

//   return passwordRegex.test(password) && unicodeRegex.test(password);
// };

// export const handleEmailChange = (data: string) => {
//   setEmail(data);
//   if (!validateEmail(data)) {
//     setEmailError('Invalid email format');
//   } else {
//     setEmailError(null);
//   }
// };

// export const handlePasswordChange = (data: string) => {
//   setPassword(data);
//   if (!validatePassword(data)) {
//     setPasswordError(
//       'Password must include at least one letter, one digit and one special symbol'
//     );
//   } else {
//     setPasswordError(null);
//   }
// };
