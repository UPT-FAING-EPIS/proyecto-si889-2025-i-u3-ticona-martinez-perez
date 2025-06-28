export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !validateRequired(value)) {
      errors[field] = `${rule.label} es requerido`;
      return;
    }
    
    if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Email no válido';
      return;
    }
    
    if (rule.type === 'password' && value && !validatePassword(value)) {
      errors[field] = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label} debe tener al menos ${rule.minLength} caracteres`;
      return;
    }
    
    if (rule.match && value !== formData[rule.match]) {
      errors[field] = 'Las contraseñas no coinciden';
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
