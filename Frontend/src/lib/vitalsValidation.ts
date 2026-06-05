/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValidationResult {
  category: string;
  interpretation: string;
  level: 'normal' | 'info' | 'warning' | 'alert' | 'critical' | 'error';
  blockEntry?: boolean;
}

export const validateBloodPressure = (systolic: number | '', diastolic: number | ''): ValidationResult | null => {
  if (systolic === '' || diastolic === '') return null;

  if (systolic > 180 || diastolic > 120) {
    return {
      category: 'Hypertensive Crisis',
      interpretation: 'Immediate medical attention (call 911 if symptoms exist).',
      level: 'critical'
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'Stage 2 Hypertension',
      interpretation: 'Lifestyle changes + medication typically required.',
      level: 'error'
    };
  }
  if (systolic >= 130 || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'Stage 1 Hypertension',
      interpretation: 'Lifestyle changes; medication may be prescribed based on risk.',
      level: 'warning'
    };
  }
  if (systolic < 90 || diastolic < 60) {
    return {
      category: 'Low Blood Pressure',
      interpretation: 'Monitor for symptoms (dizziness, fainting).',
      level: 'alert'
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'Elevated',
      interpretation: 'Lifestyle changes recommended.',
      level: 'info'
    };
  }
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'Normal',
      interpretation: 'Maintain healthy lifestyle.',
      level: 'normal'
    };
  }

  return null;
};

export const validateTemperature = (temp: number | ''): ValidationResult | null => {
  if (temp === '') return null;

  if (temp > 40.0) {
    return {
      category: 'Hyperpyrexia (Critical)',
      interpretation: 'Life-threatening; risk of organ damage; requires emergency care.',
      level: 'critical'
    };
  }
  if (temp >= 39.0 && temp <= 39.4) {
    return {
      category: 'High Fever',
      interpretation: 'Indicates significant infection or inflammation; medical attention advised.',
      level: 'error'
    };
  }
  if (temp >= 38.0) {
    return {
      category: 'Fever Threshold (Kenya/WHO)',
      interpretation: 'Clinical definition of Acute Febrile Illness; warrants investigation for infection (e.g., malaria, viral).',
      level: 'alert'
    };
  }
  if (temp >= 37.3 && temp <= 37.9) {
    return {
      category: 'High Normal / Low-Grade',
      interpretation: 'May occur post-ovulation, after exercise, or in hot environments; monitor for symptoms.',
      level: 'info'
    };
  }
  if (temp >= 36.5 && temp <= 37.2) {
    return {
      category: 'Standard Normal',
      interpretation: 'Optimal healthy range for adult women at rest.',
      level: 'normal'
    };
  }
  if (temp >= 36.1 && temp <= 36.4) {
    return {
      category: 'Low Normal',
      interpretation: 'Common in early morning; generally healthy if asymptomatic.',
      level: 'normal'
    };
  }
  if (temp < 35.0) {
    return {
      category: 'Hypothermia (Critical)',
      interpretation: 'Medical emergency; requires immediate warming and evaluation.',
      level: 'critical'
    };
  }

  return null;
};

export const validateRespiratoryRate = (rr: number | ''): ValidationResult | null => {
  if (rr === '') return null;

  if (rr > 35) {
    return {
      category: 'Critical Tachypnea',
      interpretation: 'Imminent respiratory failure or extreme systemic shock; requires immediate resuscitation.',
      level: 'critical'
    };
  }
  if (rr >= 25 && rr <= 35) {
    return {
      category: 'Severe Tachypnea',
      interpretation: 'Significant respiratory distress, severe infection (e.g., pneumonia, sepsis), or metabolic acidosis.',
      level: 'error'
    };
  }
  if (rr >= 21 && rr <= 24) {
    return {
      category: 'High Normal / Borderline',
      interpretation: 'Mild tachypnea. Often seen with mild exertion, anxiety, or early-stage infection; monitor.',
      level: 'info'
    };
  }
  if (rr >= 12 && rr <= 20) {
    return {
      category: 'Normal Resting Range',
      interpretation: 'Standard healthy range for adult women at rest. Indicates efficient gas exchange.',
      level: 'normal'
    };
  }
  if (rr >= 8 && rr <= 11) {
    return {
      category: 'Bradypnea',
      interpretation: 'Abnormally slow. May indicate drug effect, severe metabolic imbalance; evaluate if symptomatic.',
      level: 'warning'
    };
  }
  if (rr < 8) {
    return {
      category: 'Critical Bradypnea',
      interpretation: 'Life-threatening respiratory failure; immediate emergency intervention needed.',
      level: 'critical'
    };
  }

  return null;
};

export const validatePulseRate = (pr: number | ''): ValidationResult | null => {
  if (pr === '') return null;

  if (pr > 120) {
    return {
      category: 'Critical Tachycardia',
      interpretation: 'Severe tachycardia; requires immediate medical evaluation for potential shock, severe hemorrhage, or cardiac crisis.',
      level: 'critical'
    };
  }
  if (pr >= 112 && pr <= 120) {
    return {
      category: 'Tachycardia',
      interpretation: 'Elevated heart rate at rest; may indicate stress, dehydration, anemia, acute infection, or malaria.',
      level: 'error'
    };
  }
  if (pr >= 101 && pr <= 111) {
    return {
      category: 'Borderline Elevated',
      interpretation: 'Stretched normal range. Statistically observed within the Kenyan reference interval, but warrants monitoring for early infection or anemia.',
      level: 'info'
    };
  }
  if (pr >= 58 && pr <= 100) {
    return {
      category: 'Normal Resting Range',
      interpretation: 'Standard healthy range for adult women at rest. Integrates the lower limit of the 95% Kenyan reference interval (58 bpm).',
      level: 'normal'
    };
  }
  if (pr >= 40 && pr <= 57) {
    return {
      category: 'Bradycardia',
      interpretation: 'Abnormally low heart rate; concerning if accompanied by dizziness or fatigue (though normal for highly conditioned athletes).',
      level: 'warning'
    };
  }
  if (pr < 40) {
    return {
      category: 'Critical Bradycardia',
      interpretation: 'Life-threateningly low heart rate; requires immediate medical evaluation and emergency intervention.',
      level: 'critical'
    };
  }

  return null;
};

export const validateHeight = (height: number | ''): ValidationResult | null => {
  if (height === '') return null;

  if (height > 195) {
    return {
      category: 'Hard Maximum (Block)',
      interpretation: 'BLOCK ENTRY. Exceeds logical boundaries for the local demographic; flag to prevent accidental typos (e.g., accidentally typing 1550 instead of 155).',
      level: 'error',
      blockEntry: true
    };
  }
  if (height >= 181 && height <= 195) {
    return {
      category: 'Tall Stature',
      interpretation: 'INFO. Structurally tall, but completely normal and safe. No clinical risk attached.',
      level: 'info'
    };
  }
  if (height >= 150 && height <= 180) {
    return {
      category: 'Normal Stature Range',
      interpretation: 'NONE. Standard healthy reference interval for adult women in Kenya.',
      level: 'normal'
    };
  }
  if (height >= 145 && height <= 149) {
    return {
      category: 'Short Stature (Risk Zone)',
      interpretation: 'ALERT / FLAG. Below the standard 150 cm obstetric safety cutoff in Kenya. Statistically higher risk for Cephalopelvic Disproportion (CPD); requires close monitoring during delivery.',
      level: 'alert'
    };
  }
  if (height >= 100 && height <= 144) {
    return {
      category: 'Severe Stature Warning',
      interpretation: 'WARNING. Indicates dwarfism or severe skeletal dysplasia. In maternal care, this represents an extreme risk for obstructed labor; mandatory referral for elective C-section.',
      level: 'warning'
    };
  }
  if (height < 100) {
    return {
      category: 'Hard Minimum (Block)',
      interpretation: 'BLOCK ENTRY. Extremely unlikely for an adult woman; flag as an obvious data entry typo.',
      level: 'error',
      blockEntry: true
    };
  }

  return null;
};

export const validateBMI = (bmi: number | ''): ValidationResult | null => {
  if (bmi === '') return null;

  if (bmi < 15) {
    return {
      category: 'Critical Low BMI',
      interpretation: 'BMI is below the safe range (15-45). Risk of severe malnutrition or underlying illness.',
      level: 'critical'
    };
  }
  if (bmi > 45) {
    return {
      category: 'Critical High BMI',
      interpretation: 'BMI exceeds the safe range (15-45). Indicates extreme obesity; high risk for pregnancy complications.',
      level: 'critical'
    };
  }
  if (bmi >= 15 && bmi < 18.5) {
    return {
      category: 'Underweight',
      interpretation: 'Below normal BMI. Monitor nutritional intake.',
      level: 'warning'
    };
  }
  if (bmi >= 18.5 && bmi <= 24.9) {
    return {
      category: 'Normal BMI',
      interpretation: 'Healthy weight range.',
      level: 'normal'
    };
  }
  if (bmi >= 25 && bmi <= 29.9) {
    return {
      category: 'Overweight',
      interpretation: 'Increased risk for gestational diabetes and hypertension.',
      level: 'info'
    };
  }
  if (bmi >= 30 && bmi <= 45) {
    return {
      category: 'Obesity',
      interpretation: 'Significant risk for pregnancy complications. Requires close monitoring.',
      level: 'alert'
    };
  }

  return null;
};

