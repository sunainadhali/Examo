# EXAMO — Exam Management & Results Portal

A lightweight, browser-based exam management portal built with **HTML, CSS, and vanilla JavaScript**. It provides separate Teacher and Student views. Teachers can manage student records, create exams, enter marks, and publish or hide results. Students can sign in with their roll number and date of birth to view published results.

> **Project type:** Front-end demo / client-side prototype  
> **Main file:** `index.html`  
> **Backend:** None  
> **External libraries:** None

---
[view live ](https://sunainadhali.github.io/Examo/
)
## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals and Intended Use](#2-goals-and-intended-use)
3. [Features](#3-features)
4. [Technology Stack](#4-technology-stack)
5. [Project Structure](#5-project-structure)
6. [Requirements](#6-requirements)
7. [How to Run the Project](#7-how-to-run-the-project)
8. [How to Use the Portal](#8-how-to-use-the-portal)
   - [Teacher workflow](#81-teacher-workflow)
   - [Student workflow](#82-student-workflow)
9. [Demo Login Details](#9-demo-login-details)
10. [How Data Is Stored](#10-how-data-is-stored)
11. [Marks, Grades, and Result Calculations](#11-marks-grades-and-result-calculations)
12. [Interface and Accessibility Details](#12-interface-and-accessibility-details)
13. [Validation and User Feedback](#13-validation-and-user-feedback)
14. [Printing Results](#14-printing-results)
15. [Important Limitations and Security Notes](#15-important-limitations-and-security-notes)
16. [Troubleshooting](#16-troubleshooting)
17. [Possible Future Improvements](#17-possible-future-improvements)
18. [License and Credits](#18-license-and-credits)

---

## 1. Project Overview

EXAMO is a single-page exam management interface intended to demonstrate a simple examination workflow in a school or classroom setting.

The application has two roles:

- **Teacher:** signs in with a staff PIN and manages students, exams, marks, and result publication.
- **Student:** enters a roll number and date of birth to access results for exams that have been published.

The interface and application logic are contained in one HTML file. CSS styles the interface, while JavaScript handles role switching, form processing, calculations, rendering, and browser storage.

The HTML document title is `ExamDesk — Exam Management Portal`, while the visible application branding is **EXAMO**.

## 2. Goals and Intended Use

The project demonstrates how a small examination portal can:

- Maintain a list of students.
- Create examinations with subjects, dates, maximum marks, and pass marks.
- Record marks for each student in each examination.
- Calculate grades and pass/fail status.
- Display basic examination statistics.
- Control whether students can see an examination's results.
- Present a student's published results in a printable layout.

It is suitable as a learning project, classroom demonstration, or starting point for a larger application. It is **not ready to store real student records or to serve as a production examination system** without the security and backend improvements described later in this README.

## 3. Features

### 3.1 Role selection

The header contains two role buttons:

- **I'm a Teacher**
- **I'm a Student**

Selecting a role switches the visible application area without navigating to another page.

### 3.2 Teacher sign-in

- A staff PIN field is provided.
- The demonstration PIN is `1234`.
- An incorrect PIN displays an error message.
- Successful sign-in opens the teacher dashboard.
- The Sign out button returns to the teacher sign-in screen.

This is demonstration-only client-side checking, not secure authentication.

### 3.3 Teacher dashboard overview

The dashboard displays four summary cards:

| Summary | Meaning |
|---|---|
| Students | Number of student records currently stored |
| Exams | Number of examinations currently stored |
| Results published | Number of exams whose published setting is enabled |
| Drafts | Number of exams whose published setting is disabled |

### 3.4 Enter marks

The **Enter marks** section lets a teacher:

- Select an examination from a drop-down list.
- View each student's roll number and name.
- Enter marks for each student.
- See the grade and pass/fail status update while typing.
- Save the marks for the selected examination.

The marks field accepts values from `0` through that exam's maximum marks, including half-mark increments (`step="0.5"`). Leaving a field blank represents an absent student or a mark that has not been entered.

The page reminds teachers that students can see results only after the relevant exam is published.

### 3.5 Examination statistics

For the selected exam, the interface displays:

- **Marks entered:** number of stored marks compared with the number of students.
- **Class average:** arithmetic average of the entered marks.
- **Highest:** highest entered mark.
- **Pass rate:** percentage of students with entered marks who achieved at least the pass mark.

Absent or blank entries are not included in the average or pass-rate denominator.

### 3.6 Exam management

The **Exams** section allows a teacher to create and manage exams.

Each exam contains:

| Field | Description |
|---|---|
| Exam name | Name of the test or examination |
| Subject | Subject being assessed |
| Date | Examination date |
| Max marks | Maximum possible score; must be at least 1 |
| Pass marks | Minimum score required to pass; must be at least 0 and cannot exceed maximum marks |
| Publication state | Draft or Published |

New exams are initially created as **Draft**. The exam table is sorted by date, newest first.

The publication checkbox changes an exam between Draft and Published:

- **Published:** its results can appear in the student view.
- **Draft:** its results are hidden from the student view.

A teacher can delete an exam after confirming the action. Deleting an exam also deletes all marks stored for that exam.

### 3.7 Student management

The **Students** section allows a teacher to add and remove student records.

Each student record contains:

- Roll number
- Full name
- Class
- Date of birth

Roll numbers must be unique. After a student is added, the list is sorted by roll number using numeric-aware sorting.

Removing a student also removes that student's marks from every stored examination.

### 3.8 Student result view

A student enters:

- Roll number
- Date of birth

If both values match a stored student record, the portal opens that student's result page.

The result page displays:

- Student name
- Roll number and class
- Overall percentage
- Total marks obtained and maximum marks counted
- Number of exams passed out of exams with marks
- Overall result indicator
- A table of published examinations, including subject, date, marks, percentage, grade, and status

Only published exams are included in the student result table. If no exams have been published, an explanatory empty-state message is shown.

### 3.9 Notifications

A small toast notification appears near the bottom of the page after actions such as saving marks, creating or deleting an exam, adding or removing a student, and publishing or hiding results. Toast messages automatically disappear after approximately two seconds.

### 3.10 Responsive layout

The interface uses flexible layouts and CSS Grid so that form fields and summary cards can adapt to available screen width. Tables are placed inside horizontally scrollable containers to help prevent the page layout from breaking on narrow screens.

---

## 4. Technology Stack

| Technology | How it is used |
|---|---|
| HTML5 | Page structure, forms, tables, sections, labels, and buttons |
| CSS3 | Layout, colors, spacing, cards, responsive behavior, focus styles, and print styling |
| Vanilla JavaScript (ES6+) | Role switching, form events, calculations, validation, data rendering, and storage |
| Web Storage API (`localStorage`) | Saves the application data in the current browser |
| Browser Print API | Opens the browser's print dialog for a student's result |

No framework, package manager, database server, API, or external dependency is required by the current implementation.

## 5. Project Structure

The supplied project consists of a single file:

```text
exam-management-portal/
└── index.html
```

The `index.html` file contains three main parts:

```text
index.html
├── <head>
│   ├── Character encoding and viewport metadata
│   ├── Document title
│   └── Embedded CSS inside <style>
├── <body>
│   ├── Header and role selector
│   ├── Teacher view
│   │   ├── Teacher sign-in
│   │   └── Teacher dashboard
│   │       ├── Overview cards
│   │       ├── Enter marks
│   │       ├── Exams
│   │       └── Students
│   ├── Student view
│   │   ├── Student sign-in
│   │   └── Student result page
│   └── Toast notification element
└── <script>
    ├── Utility functions and initial data
    ├── Browser storage
    ├── Grade and status calculations
    ├── Role switching and teacher sign-in
    ├── Teacher dashboard rendering
    ├── Exam and student management
    └── Student result lookup and display
```

### Important JavaScript elements

| Function / constant | Responsibility |
|---|---|
| `$()` | Short helper for selecting a DOM element with `querySelector` |
| `esc()` | Escapes special HTML characters before values are inserted into HTML templates |
| `uid()` | Generates a short random identifier for a new exam |
| `fmtDate()` | Formats a stored date for display |
| `STORE_KEY` | Names the local-storage entry: `examdesk-v1` |
| `seed` | Provides the initial sample students, exams, and marks |
| `save()` | Writes the current application data to local storage |
| `grade()` | Calculates a letter grade from marks and exam settings |
| `statusPill()` | Produces the Absent, Pass, or Fail status label |
| `toast()` | Displays a temporary notification |
| `setRole()` | Switches between the teacher and student areas |
| `renderTeacher()` | Refreshes the teacher dashboard and its sections |
| `renderOverview()` | Updates the teacher summary cards |
| `renderMarks()` | Builds the marks-entry table for the selected exam |
| `renderExamStats()` | Calculates and displays statistics for the selected exam |
| `renderExams()` | Displays exams and attaches publication and deletion actions |
| `renderStudents()` | Displays student records and attaches removal actions |
| `showResults()` | Builds the selected student's published-results view |

## 6. Requirements

- A modern web browser with JavaScript enabled.
- A local copy of `index.html`.
- Browser support for `localStorage`, `structuredClone`, and modern JavaScript syntax.

A current version of Chrome, Edge, Firefox, or Safari should be suitable.

There is no need to install Node.js, npm, a database, or a server to use the supplied version.

## 7. How to Run the Project

### Option A — Open the HTML file directly

1. Save or download `index.html` to a folder on your computer.
2. Locate the file in File Explorer or your file manager.
3. Double-click `index.html`.
4. If prompted, choose a modern browser such as Chrome or Edge.
5. The EXAMO portal should open in a browser tab.

This is the simplest way to run the project. It does not require an internet connection.

### Option B — Run it through Visual Studio Code

1. Open Visual Studio Code.
2. Select **File → Open Folder**.
3. Choose the folder containing `index.html`.
4. Open `index.html` in the editor.
5. If you use the Live Server extension, right-click the file and select **Open with Live Server**.
6. The portal will open at a local development address in your browser.

Live Server is optional; it is not a project dependency.

### Option C — Host it as a static website

Because the current project is a self-contained front-end page, it can be hosted on a static web host. Upload `index.html` as the site's entry page.

**Important:** static hosting does not add a backend or make the demo authentication secure. Browser data is still stored locally for each visitor.

---

## 8. How to Use the Portal

### 8.1 Teacher workflow

The following is the recommended order for setting up and operating the portal.

#### Step 1 — Open the Teacher view

1. Open the application.
2. Select **I'm a Teacher** in the top-right role selector.
3. The teacher sign-in panel will be displayed.

#### Step 2 — Sign in

1. Enter the demo staff PIN: `1234`.
2. Select **Sign in**.
3. The teacher dashboard will appear.

If the PIN is incorrect, the portal displays an error. In the supplied code, the PIN is fixed in the JavaScript and cannot be changed through the interface.

#### Step 3 — Add students

1. Open the **Students** tab.
2. Enter the student's roll number.
3. Enter the student's full name.
4. Enter the class or section, for example `10-A`.
5. Select the student's date of birth.
6. Select **Add student**.
7. Confirm that the student appears in the table.

Use a unique roll number for every student. The portal rejects a duplicate roll number.

**Tip:** add all students before entering marks so the marks table includes the complete class list.

#### Step 4 — Create an exam

1. Open the **Exams** tab.
2. Enter an exam name, such as `Mid-Term`.
3. Enter the subject, such as `Mathematics`.
4. Select the examination date.
5. Enter the maximum marks, such as `100`.
6. Enter the pass marks, such as `35`.
7. Select **Add exam**.

The new exam is created in Draft status. It will also become available in the **Select exam** drop-down in the Enter marks tab.

The pass-mark value cannot be greater than the maximum-mark value.

#### Step 5 — Enter marks

1. Open the **Enter marks** tab.
2. Select the required exam from the **Select exam** drop-down.
3. Find each student by roll number and name.
4. Enter the student's score in the Marks field.
5. Check the automatically updated grade and status.
6. Leave the field blank if the student was absent or no mark is to be recorded.
7. Select **Save marks**.

The portal checks that each entered score is numeric and falls between zero and the exam's maximum marks. If an invalid score is found, a message appears and the relevant field receives focus.

**Important:** changes made while typing are displayed immediately, but they are not committed to browser storage until **Save marks** is selected.

#### Step 6 — Review exam statistics

After selecting an exam, review the summary cards above the marks table:

- Marks entered
- Class average
- Highest mark
- Pass rate

These figures are based on saved marks. Save the marks before relying on the statistics.

#### Step 7 — Publish results

1. Return to the **Exams** tab.
2. Find the exam in the exam table.
3. Enable its publication checkbox.
4. Confirm that its status changes from Draft to Published.

Students can now see that exam's results.

To hide the results again, disable the checkbox. The marks remain stored; only their visibility in the student result view changes.

#### Step 8 — Sign out

Select **Sign out** in the teacher dashboard. The teacher sign-in panel will return.

### 8.2 Student workflow

#### Step 1 — Open the Student view

1. Open the application.
2. Select **I'm a Student**.
3. The result lookup form will appear.

#### Step 2 — Enter student details

1. Enter the student's roll number.
2. Select the student's date of birth.
3. Select **View results**.

Both values must match a student record already stored in the browser. If they do not match, the portal displays an error message.

#### Step 3 — Read the result

The result page shows the student's name, roll number, class, overall summary, and a table of published exams.

For each published exam, the table displays the marks, percentage, grade, and status. An exam with no saved mark for that student is shown with a dash and an Absent status.

Draft exams are not displayed.

#### Step 4 — Print the result

Select **Print** to open the browser's print dialog. Choose a printer or a PDF destination if you want a digital copy.

#### Step 5 — Check another student

Select **Check another** to return to the lookup form. The form is reset so another set of details can be entered.

---

## 9. Demo Login Details

The supplied HTML file includes sample data for testing.

### Teacher

| Field | Demo value |
|---|---|
| Role | Teacher |
| Staff PIN | `1234` |

### Student

| Field | Demo value |
|---|---|
| Role | Student |
| Roll number | `1001` |
| Date of birth | `2010-04-12` |

Other seeded student roll numbers are `1002`, `1003`, `1004`, and `1005`. Their sample records and dates of birth are defined in the `seed` object inside `index.html`.

### Sample exams

| Exam | Subject | Date | Maximum | Pass | Initial state |
|---|---|---:|---:|---:|---|
| Unit Test 1 | Mathematics | 2026-09-10 | 50 | 18 | Published |
| Unit Test 1 | Science | 2026-09-12 | 50 | 18 | Published |
| Mid-Term | English | 2026-10-20 | 100 | 35 | Draft |

The seed data also includes example marks for some students. For example, student `1001` has sample marks in all three seeded exams, but the English Mid-Term result remains hidden until that exam is published.

These are demonstration records, not real student information.

---

## 10. How Data Is Stored

The application uses the browser's **localStorage** through the key:

```javascript
const STORE_KEY = "examdesk-v1";
```

The main data object contains three collections:

```javascript
{
  students: [],
  exams: [],
  marks: {}
}
```

- `students` stores student identity and class details.
- `exams` stores exam configuration and publication state.
- `marks` maps an exam ID to student roll numbers and their marks.

On startup, the application tries to read the saved JSON value from local storage. If no saved value exists, it initializes the database from the built-in `seed` data. The `save()` function serializes the current data object and writes it back to local storage.

### What this means in practice

- Data normally remains available when the same browser is closed and reopened.
- Data belongs to the browser profile and site origin being used.
- Another browser, device, browser profile, or hosted origin will not automatically share the same data.
- Clearing the browser's site data can erase the saved records.
- The current project has no cloud synchronization, shared database, or automatic backup.
- The code does not provide an export/import or reset-data screen.

For development or testing, use disposable sample records and avoid relying on local storage as the only copy of important information.

---

## 11. Marks, Grades, and Result Calculations

### 11.1 Grade calculation

The application first calculates the percentage:

```text
Percentage = (Marks obtained / Maximum marks) × 100
```

It then applies the following rules in order:

| Condition | Grade |
|---|---|
| Marks are below the exam's pass marks | F |
| Percentage is 90% or above | A+ |
| Percentage is 80% to below 90% | A |
| Percentage is 70% to below 80% | B |
| Percentage is 60% to below 70% | C |
| Otherwise, if the student has passed | D |

The pass-mark check takes priority. Therefore, a score below the configured pass marks receives `F`, even if its percentage would otherwise fall into another grade band.

### 11.2 Pass/fail status

- **Pass:** marks are greater than or equal to the exam's pass marks.
- **Fail:** marks are below the exam's pass marks.
- **Absent:** no mark is stored for that student in that exam.

### 11.3 Class average

```text
Class average = Sum of entered marks / Number of entered marks
```

Blank/absent entries are excluded.

### 11.4 Pass rate

```text
Pass rate = (Number of entered marks at or above pass marks
             / Number of entered marks) × 100
```

Students without an entered mark are excluded from this calculation.

### 11.5 Student overall percentage

The student summary adds the student's marks and the maximum marks for published exams in which the student has a recorded mark:

```text
Overall percentage = (Total marks obtained / Total maximum marks counted) × 100
```

Published exams without a mark for that student are not added to the total maximum marks. If the student has no recorded marks in any published exam, the percentage is shown as a dash.

The **Exams passed** figure counts only published exams for which a mark is recorded.

---

## 12. Interface and Accessibility Details

### Visual design

The embedded CSS defines a small set of reusable theme variables, including:

- Dark ink/navy for primary text and buttons.
- Soft neutral background and white cards.
- Blue accent for selected and live states.
- Green for pass indicators.
- Red for fail and error indicators.
- Muted gray for secondary information.

The interface uses rounded cards, compact labels, clear spacing, and responsive grids.

### Responsive behavior

- The main content has a maximum width of 960 pixels.
- Header items can wrap when the viewport is narrow.
- Summary cards and form grids use auto-fitting CSS Grid columns.
- Tables can scroll horizontally within their containers.
- Tabs can scroll horizontally when there is not enough room.

### Accessibility-related features

The page includes several helpful accessibility details:

- Form fields have visible labels.
- Focused inputs and buttons receive a visible outline.
- Role and dashboard tab controls use tab-related ARIA attributes.
- The toast uses `role="status"` and `aria-live="polite"` to announce updates.
- Decorative logo text is hidden from assistive technology.
- Screen-reader-only labels are provided for marks inputs.
- The print stylesheet hides navigation and other non-print elements.

These features are useful foundations, but the interface has not been independently audited for full WCAG conformance.

### Print styling

A print media query hides the header, non-print controls, and tabs, changes the page background to white, and removes card borders to make the result easier to print.

---

## 13. Validation and User Feedback

The current implementation includes these checks:

| Area | Validation / behavior |
|---|---|
| Teacher sign-in | PIN must match the hard-coded demo PIN |
| Student lookup | Roll number and date of birth must match a stored student |
| New student | Required fields; roll number must be unique |
| New exam | Required fields; maximum marks must be at least 1; pass marks cannot exceed maximum marks |
| Marks entry | Values must be numeric and between 0 and the selected exam's maximum |
| Exam deletion | Confirmation dialog appears before deletion |
| Student removal | Confirmation dialog appears before removal |
| HTML rendering | Dynamic text is escaped with `esc()` in the main data-rendering templates |
| Action feedback | Toast messages confirm many successful actions |

The browser also applies native form validation to fields marked `required` and to number/date input types.

---

## 14. Printing Results

The Student result view includes a **Print** button that calls:

```javascript
window.print();
```

This opens the browser's print dialog. The embedded `@media print` CSS hides the page header, navigation controls, and tabs, and simplifies the card appearance.

To save a PDF, choose **Save as PDF** or the equivalent option in the browser's print destination settings. The exact wording depends on the browser and operating system.

---

## 15. Important Limitations and Security Notes

This section is important before using the project with real students.

### 15.1 No backend or central database

All records are stored in the current browser's local storage. There is no server, API, database account, or central source of truth. A teacher and students using different devices will not share the same records.

### 15.2 Demo authentication is not secure

The teacher PIN (`1234`) is visible in the client-side JavaScript. Anyone who can inspect or modify the page can discover or bypass it. It must not be treated as a real access-control mechanism.

### 15.3 Student lookup is not secure identity verification

A roll number and date of birth are checked entirely in browser-side code against browser-side data. This is suitable only for a demonstration. It does not provide secure authentication or protect confidential results.

### 15.4 No role-based server authorization

The role selector only changes which interface is visible. It does not create separate server permissions. There is no server to enforce access restrictions.

### 15.5 No audit history

The application does not record who changed a mark, when it was changed, or what its previous value was. It also has no approval workflow.

### 15.6 No backup or data export

There is no built-in backup, import, or export function. Browser storage can be cleared or lost.

### 15.7 No advanced examination controls

The supplied version does not implement features such as question papers, attendance registers, timetables, subject enrollment, weighted assessments, moderation, result locking, or report-card templates.

### Before production use

A production-ready version should use a secure backend, a database, server-side authentication, password hashing, role-based authorization, input validation on the server, protected transport (HTTPS), audit logs, backups, and a carefully designed privacy policy. Student records and results should not be published from a browser-only demo.

---

## 16. Troubleshooting

### The page opens but looks unstyled

Make sure you are opening the supplied `index.html` file itself and that the file has not been truncated. The CSS is embedded in the HTML file, so no separate stylesheet is required.

### The teacher PIN does not work

Use the demonstration PIN `1234`. The current code checks this exact value.

### A student cannot find their result

Check that:

1. The roll number is entered exactly as stored.
2. The date of birth matches the saved record.
3. The teacher has saved marks for the relevant exam.
4. The exam has been set to Published.
5. The student is using the same browser storage context that contains the records.

### New records disappear in another browser

This is expected. Local storage is scoped to a browser profile and origin. The project does not synchronize data between browsers or devices.

### Changes to marks are not saved

After entering marks, select **Save marks**. Typing updates the on-screen grade and status, but saving is a separate action.

### An exam is missing from the student result page

Only published exams are shown. Ask the teacher to check the publication state in the Exams tab.

### The browser does not retain records

Check whether browser settings, private/incognito mode, or cleanup tools are clearing site data. Do not use private browsing for records you expect to persist.

---

## 17. Possible Future Improvements

The following are potential extensions; they are **not included** in the supplied implementation.

1. **Backend and database:** store students, exams, and marks centrally.
2. **Secure teacher accounts:** replace the hard-coded PIN with server-managed accounts and secure sessions.
3. **Student authentication:** use a secure login or one-time verification process rather than relying on date of birth.
4. **Role-based access control:** enforce teacher and student permissions on the server.
5. **Edit student records:** allow authorized updates to names, classes, and other student details.
6. **Edit exam details:** support controlled changes to exam metadata.
7. **Bulk marks import:** upload marks from CSV or spreadsheet files.
8. **Data export:** export student lists, marks, and results.
9. **Backup and restore:** provide reliable scheduled backups and recovery.
10. **Audit log:** record mark changes, publication actions, and administrative activity.
11. **Search and filters:** find students by name, roll number, or class.
12. **More detailed reports:** class rankings, subject summaries, grade distributions, and individual report cards.
13. **Improved accessibility:** keyboard interaction testing and a formal accessibility review.
14. **Automated tests:** validate grading boundaries, calculations, publication behavior, and data handling.
15. **Deployment hardening:** configure HTTPS, secure headers, monitoring, and operational procedures.

---

## 18. TEAM MEMBERS

- Omkar Sharma |Sunaina Dhali | Sanjana Dhali
