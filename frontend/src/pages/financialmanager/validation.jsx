// frontend/src/pages/financialmanager/validation.jsx
export const validateNumber = (value) => {
  if (value === '' || value === null || value === undefined) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

export const validateText = (value) => {
  if (!value || typeof value !== 'string') return false;
  return /^[a-zA-Z\s]*$/.test(value.trim());
};

export const validateDate = (dateString, maxDaysPast = 7) => {
  if (!dateString) return false;
  
  const inputDate = new Date(dateString);
  const today = new Date();
  const maxPastDate = new Date();
  maxPastDate.setDate(today.getDate() - maxDaysPast);
  
  // Reset time parts for accurate comparison
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  maxPastDate.setHours(0, 0, 0, 0);
  
  return inputDate <= today && inputDate >= maxPastDate;
};

export const preventNonNumericInput = (e) => {
  if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
    e.preventDefault();
  }
};

export const preventNumericInput = (e) => {
  if (!isNaN(parseInt(e.key))) {
    e.preventDefault();
  }
};