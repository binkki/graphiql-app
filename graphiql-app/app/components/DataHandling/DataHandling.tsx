export const validateEmail = (email: string) => {
  if (email.length < 3) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const firebaseEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return firebaseEmailRegex.test(email);
};

export const validatePassword = (password: string) => {
  const unicodeRegex = /[\p{L}\p{N}\p{P}\p{S}]/u;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

  return passwordRegex.test(password) && unicodeRegex.test(password);
};
