# Search MCQs Skill

Exposes an endpoint to search and retrieve high-yield medical multiple choice questions (MCQs) across 19 MBBS subjects.

## Endpoint

`GET https://api.openmedq.com/api/questions/pack`

### Parameters

- `subjectId` (required): The ID of the subject (1-19).
  - 1: Anatomy
  - 2: Physiology
  - 3: Biochemistry
  - 4: Pharmacology
  - 5: Pathology
  - 6: Microbiology
  - 7: Forensic Medicine
  - 8: SPM
  - 9: Ophthalmology
  - 10: ENT
  - 11: Medicine
  - 12: Surgery
  - 13: OBGY
  - 14: Pediatrics
  - 15: Orthopedics
  - 16: Dermatology
  - 17: Psychiatry
  - 18: Radiology
  - 19: Anesthesiology
- `topicId` (optional): The ID of the specific topic within the subject.
- `examType` (optional): Filter by exam type (e.g. `NEET_PG`, `FMGE`, `INICET`).
- `year` (optional): Filter by exam year.
- `isPYQ` (optional): Set to `true` to return only Previous Year Questions.
- `limit` (optional, default: 50, max: 100): Limit the number of questions returned.

### Response

Returns a JSON object with:
- `success`: boolean
- `questions`: Array of question objects containing:
  - `id`: number
  - `subjectId`: number
  - `topicId`: number
  - `questionText`: string
  - `options`: Array of 4 strings (Options A, B, C, D)
  - `correctOption`: number (1-4, mapped to A-D)
  - `explanation`: string
  - `examType`: string
  - `examYear`: number
