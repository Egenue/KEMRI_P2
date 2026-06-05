# **THIS IS A LIST OF CHANGES TO IMPLEMENT**
- Blood Pressure Logical Limits
- Body Temparature Logical Limits
- Respiratory Rate
- Pulse Rate (Heart Rate)
- Height and Weight



## 1. Blood Pressure Logical Limits


|*Category*|*Systolic (mm Hg)*||*Diastolic (mm Hg)*|*Action Required*|
|:-------|:------|:---------------:|:----------------|:--------------|
|Normal|Less than 120||Less than 80|Maintain healthy lifestyle.| 
|Elevated|120 – 129|and|Less than 80|Lifestyle changes recommended.| 
|Stage 1 Hypertension|130 – 139|or|80 – 89|Lifestyle changes; medication may be prescribed based on risk.|
|Stage 2 Hypertension|140 or higher|or|90 or higher|Lifestyle changes + medication typically required.|
|Hypertensive Crisis|Higher than 180|and/or|Higher than 120|Immediate medical attention (call 911 if symptoms exist).| 
|Low Blood Pressure|Less than 90|or|Less than 60|Monitor for symptoms (dizziness, fainting).  


## 2. Body Temparature Logical Limits 
|*Category*|	*Temperature Range (°C)*|	*Clinical Interpretation*|
|:-------|:----------------:|:------------------------|
|**Hypothermia (Critical)**|	< 35.0°C|Medical emergency; requires immediate warming and evaluation.|
|**Low Normal**|	36.1°C – 36.4°C|	Common in early morning; generally healthy if asymptomatic.| 
|**Standard Normal**	|36.5°C – 37.2°C	|	Optimal healthy range for adult women at rest. |
|**High Normal / Low-Grade**|	37.3°C – 37.9°C|	May occur post-ovulation, after exercise, or in hot environments; monitor for symptoms.| 
|**Fever Threshold (Kenya/WHO)**|	≥ 38.0°C	|Clinical definition of Acute Febrile Illness; warrants investigation for infection (e.g., malaria, viral). |
|**High Fever**|	39.0°C – 39.4°C	|Indicates significant infection or inflammation; medical attention advised. |
|**Hyperpyrexia (Critical)**|	> 40.0°C	|	Life-threatening; risk of organ damage; requires emergency care.|


## 3. Respiratory Rate Logical Limits

| *Category* | *Respiratory Rate (breaths/min)* | *Clinical Interpretation*|
| :--- | :---: | :--- |
| **Critical Bradypnea** | < 8 | Life-threatening respiratory failure; immediate emergency intervention needed. |
| **Bradypnea** | 8 – 11 | Abnormally slow. May indicate drug effect, severe metabolic imbalance; evaluate if symptomatic. |
| **Normal Resting Range** | 12 – 20 | Standard healthy range for adult women at rest. Indicates efficient gas exchange. |
| **High Normal / Borderline** | 21 – 24 | Mild tachypnea. Often seen with mild exertion, anxiety, or early-stage infection; monitor. |
| **Severe Tachypnea** | 25 – 35 | Significant respiratory distress, severe infection (e.g., pneumonia, sepsis), or metabolic acidosis. |
| **Critical Tachypnea** | > 35 | Imminent respiratory failure or extreme systemic shock; requires immediate resuscitation. |


## 4. Pulse Rate Logical Limits

| *Category* | *Pulse Rate Range (bpm)* | *Clinical Interpretation* |
| :--- | :---: | :--- |
| **Critical Bradycardia** | < 40 | Life-threateningly low heart rate; requires immediate medical evaluation and emergency intervention. |
| **Bradycardia** | 40 – 57 | Abnormally low heart rate; concerning if accompanied by dizziness or fatigue (though normal for highly conditioned athletes). |
| **Normal Resting Range** | 58 – 100 | Standard healthy range for adult women at rest. Integrates the lower limit of the 95% Kenyan reference interval (58 bpm). |
| **Borderline Elevated** | 101 – 111 | Stretched normal range. Statistically observed within the Kenyan reference interval, but warrants monitoring for early infection or anemia. |
| **Tachycardia** | 112 – 120 | Elevated heart rate at rest; may indicate stress, dehydration, anemia, acute infection, or malaria. |
| **Critical Tachycardia** | > 120 | Severe tachycardia; requires immediate medical evaluation for potential shock, severe hemorrhage, or cardiac crisis. |


## 5. Height Logical Limits

| *Category* | *Height Range (cm)* | *Clinical Interpretation / System Action* |
| :--- | :---: | :--- |
| **Hard Minimum (Block)** | < 100 cm | **System Action: BLOCK ENTRY.** Extremely unlikely for an adult woman; flag as an obvious data entry typo. |
| **Severe Stature Warning** | 100 – 144 cm | **System Action: WARNING.** Indicates dwarfism or severe skeletal dysplasia. In maternal care, this represents an extreme risk for obstructed labor; mandatory referral for elective C-section. |
| **Short Stature (Risk Zone)** | 145 – 149 cm | **System Action: ALERT / FLAG.** Below the standard 150 cm obstetric safety cutoff in Kenya. Statistically higher risk for Cephalopelvic Disproportion (CPD); requires close monitoring during delivery. |
| **Normal Stature Range** | 150 – 180 cm | **System Action: NONE.** Standard healthy reference interval for adult women in Kenya. |
| **Tall Stature** | 181 – 195 cm | **System Action: INFO.** Structurally tall, but completely normal and safe. No clinical risk attached. |
| **Hard Maximum (Block)** | > 195 cm | **System Action: BLOCK ENTRY.** Exceeds logical boundaries for the local demographic; flag to prevent accidental typos (e.g., accidentally typing 1550 instead of 155). |