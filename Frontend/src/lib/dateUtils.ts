/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates years and months between DOB and the interview date.
 */
export function calculateAge(dobString: string, interviewDateString: string): { years: number; months: number } {
  if (!dobString) return { years: 0, months: 0 };
  
  const dob = new Date(dobString);
  const interview = interviewDateString ? new Date(interviewDateString) : new Date();
  
  if (isNaN(dob.getTime()) || isNaN(interview.getTime())) {
    return { years: 0, months: 0 };
  }

  let years = interview.getFullYear() - dob.getFullYear();
  let months = interview.getMonth() - dob.getMonth();
  
  if (months < 0 || (months === 0 && interview.getDate() < dob.getDate())) {
    years--;
    months += 12;
  }
  
  if (interview.getDate() < dob.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
    }
  }

  return { 
    years: Math.max(0, years), 
    months: Math.max(0, months) 
  };
}

/**
 * Validates if the date of birth lies between Jan 1, 1972 and Jan 1, 2006 (inclusive).
 */
export function isValidDob(dobString: string): boolean {
  if (!dobString) return false;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return false;

  const minDate = new Date('1972-01-01');
  const maxDate = new Date('2006-01-01');

  return dob >= minDate && dob <= maxDate;
}

/**
 * Formats a Date (or YYYY-MM-DD string) to DD/MMM/YYYY or returns empty/placeholder
 */
export function formatToDdmMmyyyy(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
