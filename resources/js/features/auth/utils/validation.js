// Frontend validation rules that match Laravel Fortify backend validation
// Keep these in sync with backend validation rules

export const validationRules = {
  // Email validation
  email: {
    required: (value) => !!value || 'Email is required',
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || 'Please enter a valid email address'
    },
    maxLength: (value) => value.length <= 255 || 'Email must be less than 255 characters'
  },

  // Password validation (matches Laravel default rules)
  password: {
    required: (value) => !!value || 'Password is required',
    minLength: (value) => value.length >= 8 || 'Password must be at least 8 characters',
    maxLength: (value) => value.length <= 255 || 'Password must be less than 255 characters'
  },

  // Password confirmation
  passwordConfirmation: {
    required: (value) => !!value || 'Password confirmation is required',
    matches: (value, password) => value === password || 'Password confirmation does not match'
  },

  // Name validation
  name: {
    required: (value) => !!value || 'Name is required',
    minLength: (value) => value.length >= 2 || 'Name must be at least 2 characters',
    maxLength: (value) => value.length <= 255 || 'Name must be less than 255 characters'
  },

  // Two-factor code validation
  twoFactorCode: {
    required: (value) => !!value || 'Authentication code is required',
    length: (value) => value.length === 6 || 'Authentication code must be 6 digits',
    numeric: (value) => /^\d+$/.test(value) || 'Authentication code must contain only numbers'
  }
}

// Validation helper functions
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const result = rule(value)
    if (result !== true) {
      return result // Return error message
    }
  }
  return true // All validations passed
}

export const validateEmail = (email) => {
  const rules = [
    validationRules.email.required,
    validationRules.email.email,
    validationRules.email.maxLength
  ]
  return validateField(email, rules)
}

export const validatePassword = (password) => {
  const rules = [
    validationRules.password.required,
    validationRules.password.minLength,
    validationRules.password.maxLength
  ]
  return validateField(password, rules)
}

export const validatePasswordConfirmation = (passwordConfirmation, password) => {
  const rules = [
    validationRules.passwordConfirmation.required,
    (value) => validationRules.passwordConfirmation.matches(value, password)
  ]
  return validateField(passwordConfirmation, rules)
}

export const validateName = (name) => {
  const rules = [
    validationRules.name.required,
    validationRules.name.minLength,
    validationRules.name.maxLength
  ]
  return validateField(name, rules)
}

export const validateTwoFactorCode = (code) => {
  const rules = [
    validationRules.twoFactorCode.required,
    validationRules.twoFactorCode.length,
    validationRules.twoFactorCode.numeric
  ]
  return validateField(code, rules)
}

// Login form validation
export const validateLoginForm = (email, password) => {
  const errors = {}

  const emailError = validateEmail(email)
  if (emailError !== true) {
    errors.email = emailError
  }

  const passwordError = validatePassword(password)
  if (passwordError !== true) {
    errors.password = passwordError
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Register form validation
export const validateRegisterForm = (name, email, password, passwordConfirmation) => {
  const errors = {}

  const nameError = validateName(name)
  if (nameError !== true) {
    errors.name = nameError
  }

  const emailError = validateEmail(email)
  if (emailError !== true) {
    errors.email = emailError
  }

  const passwordError = validatePassword(password)
  if (passwordError !== true) {
    errors.password = passwordError
  }

  const passwordConfirmationError = validatePasswordConfirmation(passwordConfirmation, password)
  if (passwordConfirmationError !== true) {
    errors.password_confirmation = passwordConfirmationError
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
} 