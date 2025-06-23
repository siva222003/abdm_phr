export const ABHA_NUMBER_REGEX = /^\d{2}-\d{4}-\d{4}-\d{4}$/;
export const ABHA_ADDRESS_REGEX = /^(?![\d.])[a-zA-Z0-9._]{4,}(?<!\.)$/;
export const MOBILE_NUMBER_REGEX = /^[1-9][0-9]{9}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$^-])[A-Za-z\d!@#$%^&*-]{8,}$/;
export const DATE_OF_BIRTH_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const PIN_CODE_REGEX = /^\d{6}$/;



export const ABHA_ADDRESS_VALIDATION_RULES = (abhaInput: string) => [
  {
    condition: abhaInput.length >= 4,
    content: "Must be at least 4 characters",
  },
  {
    condition: /^[a-zA-Z_]/.test(abhaInput),
    content: "Must start with alphabet or underscore",
  },
  { 
    condition: !abhaInput.endsWith("."), 
    content: "Must not end with a dot" 
  },
  {
    condition: /^[0-9a-zA-Z._]+$/.test(abhaInput),
    content: "Can only contain alphanumeric, dots, underscores",
  },
];

export const PASSWORD_VALIDATION_RULES = (password: string) => [
  {
    condition: /[A-Z]/.test(password),
    content: "Must contain at least one uppercase letter",
  },
  {
    condition: /\d/.test(password),
    content: "Must contain at least one number",
  },
  {
    condition: /[!@#$^*-]/.test(password),
    content: "Must contain at least one special character (!@#$^-)",
  },
  {
    condition: password.length >= 8,
    content: "Must be at least 8 characters long",
  },
];
