# Examo

Examo is a browser-based exam management and results portal for a school or class. It lets a teacher manage students, exam records, marks, and published results, and it lets a student check their published results using their roll number and date of birth.

The project is built as a lightweight front-end app with plain HTML, CSS, and JavaScript. There is no backend, no database, and no authentication system beyond a demo PIN used for the teacher view.

## Features

### Teacher dashboard
- Sign in with a staff PIN (`1234` in the demo)
- View summary cards for students, exams, published results, and drafts
- Add, publish, hide, and delete exams
- Add students with roll number, full name, class, and date of birth
- Remove students and automatically clear their marks from all exams
- Select an exam and enter marks for each student
- Save marks with validation for min/max score checks
- See live grade and pass/fail status updates while entering marks
- Review class-level analysis, including average, highest mark, and pass rate
- Browse subject-based question bank examples
- View a top-10 leaderboard based on weighted average across published exams

### Student results view
- Sign in with roll number and date of birth
- View a student's published exam results only
- See overall percentage, total marks, passed exams, and a result badge
- Review a table of published exams with subject, date, mark, percentage, grade, and status
- View a chart of their exam performance
- Print results from the browser

### Extra UI behavior
- Responsive layout for desktop and smaller screens
- Toast notifications for common actions
- Demo seed data that loads on first run
- Local browser storage using `localStorage`

## Project structure

```text
Examo/
├── index.html      # App structure and UI layout
├── Examo.css       # Styling and responsive design
├── Examo.js        # App logic, validation, rendering, and storage
└── README.md       # Project documentation
```

## How to run

1. Open the project folder in a browser.
2. Launch `index.html` directly in any modern browser.
3. The app will use browser storage to persist changes locally.

There are no dependencies to install or build.

## Demo login details

### Teacher
- PIN: `1234`

### Student
Example student data included in the seed data:
- Roll number: `1001`
- Date of birth: `2010-04-12`

## Data model and storage

The app stores its data in the browser's `localStorage` under the key:

```text
examdesk-v1
```

The initial seed data contains sample students, exam records, and marks. If no saved data is present, the app loads the seed dataset automatically.

The data is structured as:

```js
{
  students: [
    { roll, name, cls, dob }
  ],
  exams: [
    { id, name, subject, date, max, pass, published }
  ],
  marks: {
    examId: { roll: score }
  }
}
```

## Exam logic

- Exam pass marks cannot exceed the exam's max marks.
- Student grades are calculated from percentage score once the score meets the exam pass mark:
  - `A+` for 90%+
  - `A` for 80%+
  - `B` for 70%+
  - `C` for 60%+
  - `D` for any score that passes but is below 60%
  - `F` for scores below the pass mark
- A student is counted as passed for a specific exam if their mark meets the exam's pass threshold.
- Published exams are the only ones shown to a student in the results view.

## Notes on the current implementation

This is a front-end prototype and is intentionally simple:

- There is no server-side backend.
- Teacher PIN checking is only a demo and is not secure.
- Student data and exam records are stored in the browser, not a real database.
- Anyone with browser access on the same machine could view or edit local data.

This project is good for demos, learning, and local prototyping, but it should not be used for live student records or production exam workflows without major security and backend improvements.

## Screens and sections

The interface is organized into two main roles:

### Teacher mode
- Sign in screen
- Overview stats
- Results analysis chart
- Question bank section
- Top 10 leaderboard
- Tabs for marks, exams, and students

### Student mode
- Roll number and DOB form
- Results dashboard
- Published exam table
- Student-specific analysis chart
- Question bank section
- Leaderboard
- Print option

## Browser support

This app works in modern desktop browsers that support:
- `localStorage`
- `FormData`
- ES6 features such as template literals and arrow functions

## License

This project is provided as-is for educational and demonstration purposes.
