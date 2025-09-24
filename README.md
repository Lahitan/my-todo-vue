# My Todo Vue Application

## Project Description

My Todo Vue Application is a simple yet effective task management tool built with Vue.js. It allows users to create, view, update, and delete their daily tasks. The application also includes an AI-powered motivation feature to provide users with summaries about the app and motivational quotes to boost productivity.

## Features

- **Task Management**: Create, view, edit, and delete individual todo tasks.
- **Task Details**: View detailed information for each task.
- **Filtering & Searching**: Easily filter tasks by status (all, completed, pending) and search by name.
- **User Personalization**: Stores a unique user ID and name locally to personalize the experience.
- **AI Motivation Popup**: Get an AI-generated summary of the app and a motivational message through a dedicated popup.
- **Pagination**: Navigate through lists of tasks with pagination controls.

## API Documentation - Task Object

Here is the structure of a single task object as received from the API:

```json
{
  "id": "string",
  "name": "string",
  "description": null,
  "start": null,
  "end": null,
  "duration": null,
  "priority": "LOW",
  "status": "TODO",
  "archived": true,
  "isDefault": null,
  "parentId": null,
  "children": "string",
  "owner": null,
  "tags": null,
  "completedAt": null,
  "createdAt": null,
  "updatedAt": null
}
```

## Setup and Installation

Follow these steps to get your project up and running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-todo-vue
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Configure Environment Variables (for AI Feature)

To enable the AI Motivation feature, you need a Google Gemini API key.

- **Obtain a Google Gemini API Key**: Go to [Google AI Studio](https://ai.google.dev/) (or Google Cloud Console) to generate your API key.

- **Create `.env` file**: In the **root directory** of your project (the same folder as `package.json`), create a file named `.env`.

- **Add API Key**: Add the following line to your `.env` file, replacing `YOUR_ACTUAL_GEMINI_API_KEY` with your key:

  ```
  VITE_GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
  ```

  **Important**: Ensure no spaces around the `=` sign and no quotes around the API key.

### 4. Start the Development Server

Using npm:

```bash
npm run dev
```

Or using Yarn:

```bash
yarn dev
```

The application will typically be available at `http://localhost:5173/` (or another port if 5173 is in use).

## Usage

- **Home Page**: View all your todos, search, filter, and add new tasks.
- **Add Todo**: Click the "Add Todo" button to open a modal and create a new task.
- **Task Details**: Click on any todo item to view its details, edit, or delete it.
- **AI Motivation**: Click the "✨ Get AI Motivation" button to receive an AI-generated summary and motivational quote.

## Technologies Used

- [Vue.js 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Vue Query (`@tanstack/vue-query`)](https://vue-query.tanstack.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/)
- Google Gemini API (for AI Motivation)
