export default function isValidEmailFormat(email: string) {
  const emailRegex = /^[\w-_.]+@([\w-]+\.)+[\w-]{2,4}$/;

  return emailRegex.test(email);
}
