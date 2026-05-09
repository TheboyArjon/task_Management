# TaskFlow — Task Management System

A full-stack Task Management Application built with **React + Firebase**.

## Tech Stack

| Layer          | Technology                       |
|----------------|----------------------------------|
| Frontend       | React 18 + Vite                  |
| Styling        | Tailwind CSS                     |
| Backend/DB     | Firebase Firestore (NoSQL)       |
| Authentication | Firebase Auth (Email/Password)   |
| Routing        | React Router DOM v6              |
| Notifications  | react-hot-toast                  |

---

## Features

- **Auth**: Register, Login, Logout, Protected Routes, Persistent Session
- **Tasks CRUD**: Create, Read, Update, Delete tasks
- **Task Fields**: Title, Description, Status (Pending/Completed), Priority (Low/Medium/High), Created Date
- **Bonus**: Search & Filter, Dark Mode, Toast Notifications, Real-time updates

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation with logout & dark mode
│   ├── ProtectedRoute.jsx  # Auth guard for private routes
│   ├── TaskCard.jsx        # Individual task display card
│   └── TaskForm.jsx        # Create / Edit task modal form
├── context/
│   └── AuthContext.jsx     # Firebase Auth context + hooks
├── hooks/
│   └── useTasks.js         # Firestore CRUD operations
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Register page
│   └── Dashboard.jsx       # Main task management dashboard
├── utils/
│   └── firebase.js         # Firebase initialization
├── App.jsx                 # Router + providers
├── main.jsx                # Entry point
└── index.css               # Tailwind + global styles
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password sign-in
4. Create a **Firestore Database** (start in test mode or use the rules below)
5. Go to Project Settings → Your Apps → Add Web App → Copy config

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 6. Build for production

```bash
npm run build
```

---

## Database Schema

### Collection: `tasks`

| Field       | Type      | Description                      |
|-------------|-----------|----------------------------------|
| `uid`       | string    | Firebase Auth user ID (owner)    |
| `title`     | string    | Task title                       |
| `description` | string  | Task description (optional)      |
| `status`    | string    | `"Pending"` or `"Completed"`     |
| `priority`  | string    | `"low"`, `"medium"`, or `"high"` |
| `createdAt` | timestamp | Firestore server timestamp       |
| `updatedAt` | timestamp | Last update timestamp            |

---

## Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // Only authenticated user who owns the task can read/write
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

Paste these in **Firestore → Rules** tab.

---

## Marking Criteria Coverage

| Section | Requirement | Status |
|---------|-------------|--------|
| A | React project setup | ✅ Vite + React 18 |
| A | Responsive UI | ✅ Tailwind responsive grid |
| A | Login/Register/Dashboard/Form pages | ✅ All 4 pages |
| B | JWT/Firebase Auth | ✅ Firebase Email/Password |
| B | Registration & Login | ✅ |
| B | Protected routes | ✅ ProtectedRoute component |
| B | Logout & session handling | ✅ onAuthStateChanged + localStorage theme |
| C | Create Task | ✅ |
| C | View Task List | ✅ Real-time Firestore listener |
| C | Update Task | ✅ Edit modal |
| C | Delete Task | ✅ With confirmation |
| C | Task fields (title, desc, status, date) | ✅ All present |
| D | Firebase collection structure | ✅ `tasks` collection |
| D | Security rules | ✅ UID-scoped rules |
| D | Error handling | ✅ try/catch + toast errors |
| E | Clean code | ✅ ESM modules, named exports |
| E | Reusable components | ✅ TaskCard, TaskForm, Navbar |
| E | Folder structure | ✅ pages/components/hooks/context |
| Bonus | Search & Filter | ✅ |
| Bonus | Dark Mode | ✅ |
| Bonus | Toast Notifications | ✅ react-hot-toast |
| Bonus | Task Priority | ✅ Low/Medium/High |
