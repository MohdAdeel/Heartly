/**
 * VALIDATION FUNCTIONS
 * ====================
 * Reusable validation functions for form inputs and data
 */

/**
 * Validate email address
 * @param email - Email string to validate
 * @returns true if email is valid, false otherwise
 * @example
 * isValidEmail("user@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email.trim());
};

/**
 * Validate phone number
 * Supports various formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
 * @param phone - Phone number string to validate
 * @returns true if phone is valid, false otherwise
 * @example
 * isValidPhone("+1234567890") // true
 * isValidPhone("123-456-7890") // true
 * isValidPhone("invalid") // false
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim().length === 0) {
    return false;
  }

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Check if it starts with + (international) or is 10+ digits
  if (cleaned.startsWith('+')) {
    // International format: + followed by 7-15 digits
    return /^\+[1-9]\d{6,14}$/.test(cleaned);
  } else {
    // Local format: 10-15 digits
    return /^\d{10,15}$/.test(cleaned);
  }
};

/**
 * Validate password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param password - Password string to validate
 * @returns true if password meets requirements, false otherwise
 * @example
 * isStrongPassword("Password123") // true
 * isStrongPassword("weak") // false
 */
export const isStrongPassword = (password: string): boolean => {
  if (!password || password.length < 8) {
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Validate name (first name, last name, etc.)
 * Allows letters, spaces, hyphens, and apostrophes
 * @param name - Name string to validate
 * @returns true if name is valid, false otherwise
 * @example
 * isValidName("John Doe") // true
 * isValidName("Mary-Jane O'Connor") // true
 * isValidName("123Invalid") // false
 */
export const isValidName = (name: string): boolean => {
  if (!name || name.trim().length === 0) {
    return false;
  }

  // Allow letters, spaces, hyphens, apostrophes
  // Minimum 2 characters, maximum 50
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;

  return nameRegex.test(name.trim());
};

/**
 * Validate age (for matchmaking app)
 * @param age - Age number to validate
 * @param minAge - Minimum age (default: 18)
 * @param maxAge - Maximum age (default: 100)
 * @returns true if age is valid, false otherwise
 * @example
 * isValidAge(25) // true
 * isValidAge(17) // false
 */
export const isValidAge = (
  age: number,
  minAge: number = 18,
  maxAge: number = 100,
): boolean => {
  return (
    typeof age === 'number' && !isNaN(age) && age >= minAge && age <= maxAge
  );
};

/**
 * Validate if string is not empty
 * @param value - String to validate
 * @returns true if string has content, false otherwise
 * @example
 * isNotEmpty("Hello") // true
 * isNotEmpty("   ") // false
 */
export const isNotEmpty = (value: string): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Validate URL
 * @param url - URL string to validate
 * @returns true if URL is valid, false otherwise
 * @example
 * isValidURL("https://example.com") // true
 * isValidURL("not-a-url") // false
 */
export const isValidURL = (url: string): boolean => {
  if (!url || url.trim().length === 0) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date of birth
 * Checks if date is in the past and person is at least 18 years old
 * @param dateOfBirth - Date string or Date object
 * @returns true if date is valid, false otherwise
 * @example
 * isValidDateOfBirth("1995-01-01") // true
 * isValidDateOfBirth("2010-01-01") // false (too young)
 */
export const isValidDateOfBirth = (dateOfBirth: string | Date): boolean => {
  if (!dateOfBirth) {
    return false;
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  // Check if date is valid
  if (isNaN(birthDate.getTime())) {
    return false;
  }

  // Check if date is in the past
  if (birthDate >= today) {
    return false;
  }

  // Check if person is at least 18 years old
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

/**
 * Validate OTP/PIN code
 * @param otp - OTP string to validate
 * @param length - Expected length (default: 6)
 * @returns true if OTP is valid, false otherwise
 * @example
 * isValidOTP("123456") // true
 * isValidOTP("12345") // false
 */
export const isValidOTP = (otp: string, length: number = 6): boolean => {
  if (!otp) {
    return false;
  }

  const otpRegex = new RegExp(`^\\d{${length}}$`);
  return otpRegex.test(otp);
};
