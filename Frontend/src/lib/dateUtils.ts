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

export function isValidDob(dobString: string): boolean {
  if (!dobString) return false;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return false;

  const minDate = new Date('1972-01-01');
  const maxDate = new Date('2006-01-01');

  return dob >= minDate && dob <= maxDate;
}


export function formatToDdmMmyyyy(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export interface GAIAParameters {
  ultrasoundDate: string;
  usWeeks: number;
  usDays: number;
  lmpDate?: string;
  lmpCertainty?: 'certain' | 'uncertain' | '';
  enrolmentDate: string;
}

export interface GAIAResult {
  trimester: string;
  pregnancyStartByUS: Date;
  finalPregnancyStartDate: Date;
  source: string;
  loc: string;
  absDiff: number | null;
  gaAtEnrolmentDays: number;
  edd: Date;
  error?: string;
}

export function calculateGAIA(params: GAIAParameters): GAIAResult {
  const { ultrasoundDate, usWeeks, usDays, lmpDate, lmpCertainty, enrolmentDate } = params;
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const usDate = new Date(ultrasoundDate);
  usDate.setHours(0,0,0,0);
  
  const enrDate = new Date(enrolmentDate);
  enrDate.setHours(0,0,0,0);
  
  const result: GAIAResult = {
    trimester: "N/A",
    pregnancyStartByUS: new Date(),
    finalPregnancyStartDate: new Date(),
    source: "N/A",
    loc: "N/A",
    absDiff: null,
    gaAtEnrolmentDays: 0,
    edd: new Date()
  };

  // Logical Limits Validation
  if (usDate > today) {
    result.error = "Ultrasound date cannot be in the future.";
    return result;
  }

  if (usWeeks < 0 || usWeeks > 42) {
    result.error = "Ultrasound weeks must be between 0 and 42.";
    return result;
  }

  if (usDays < 0 || usDays > 6) {
    result.error = "Ultrasound days must be between 0 and 6.";
    return result;
  }

  if (lmpDate) {
    const lmp = new Date(lmpDate);
    lmp.setHours(0,0,0,0);
    if (lmp > today) {
      result.error = "LMP date cannot be in the future.";
      return result;
    }
    if (lmp > usDate) {
      result.error = "LMP date cannot be after ultrasound date.";
      return result;
    }
  }

  const usGA_days = usWeeks * 7 + usDays;
  
  const trimester = usGA_days <= 97 ? "First" : (usGA_days <= 195 ? "Second" : "Third or beyond");
  
  const pregnancyStartByUS = new Date(usDate.getTime() - usGA_days * 86400000);
  pregnancyStartByUS.setHours(0,0,0,0);
  
  let finalPregnancyStartDate = new Date(pregnancyStartByUS);
  let source = "Ultrasound";
  let loc = "";
  let absDiff: number | null = null;
  
  if (lmpDate) {
    const lmp = new Date(lmpDate);
    lmp.setHours(0,0,0,0);
    
    const diff_us_lmp = Math.round((pregnancyStartByUS.getTime() - lmp.getTime()) / 86400000);
    absDiff = Math.abs(diff_us_lmp);
    
    if (trimester === "First") {
      loc = "LOC-1";
      if (absDiff <= 7 && lmpCertainty === 'certain') {
        finalPregnancyStartDate = new Date(lmp);
        source = "LMP";
      }
    } else if (trimester === "Second") {
      if (lmpCertainty === 'certain') {
        loc = "LOC-2a";
        if (absDiff <= 14) {
          finalPregnancyStartDate = new Date(lmp);
          source = "LMP";
        }
      } else {
        loc = "LOC-2b";
        if (absDiff <= 10) {
          finalPregnancyStartDate = new Date(lmp);
          source = "LMP";
        }
      }
    } else {
      loc = "NOT LOC 1-2b";
    }
  } else {
    loc = trimester === "First" ? "LOC-1" : (trimester === "Second" ? "LOC-2b" : "NOT LOC 1-2b");
  }
  
  const gaAtEnrolmentDays = Math.round((enrDate.getTime() - finalPregnancyStartDate.getTime()) / 86400000);
  
  if (gaAtEnrolmentDays < 0) {
    result.error = "Calculated pregnancy start is after enrolment date.";
    return result;
  }

  const edd = new Date(finalPregnancyStartDate.getTime() + 280 * 86400000);
  
  return {
    trimester,
    pregnancyStartByUS,
    finalPregnancyStartDate,
    source,
    loc,
    absDiff,
    gaAtEnrolmentDays,
    edd
  };
}
