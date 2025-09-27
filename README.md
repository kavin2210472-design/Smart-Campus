# EcoWatch Campus - Smart Environmental Monitoring

This is a Next.js application built in Firebase Studio. It's a dashboard for real-time environmental monitoring, featuring predictive AQI alerts and AI-driven corrective action suggestions.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Google AI (Gemini)](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **State Management**: React Hooks and custom hooks for simulated real-time data.

---

## How It Was Built

This project was developed iteratively in Firebase Studio, leveraging a conversational AI assistant to build, design, and implement features. The application is architected around a modern, component-based stack.

### 1. AI-Powered Features with Genkit

The core intelligence of the application is powered by Google's Gemini model, orchestrated through Genkit flows.

- **Predictive AQI Alerts (`predict-aqi-alerts.ts`)**:
  - This flow takes historical sensor data from a specific campus zone as input.
  - It prompts the Gemini model to act as an environmental prediction specialist, analyzing trends to forecast Air Quality Index (AQI) levels up to two hours in the future.
  - The model returns a structured JSON object containing a list of 0-2 potential alerts, each with a title, description, predicted AQI, confidence score, and risk level. This allows the UI to display detailed, actionable forecasts.

- **AI-Driven Corrective Actions (`suggest-corrective-actions.ts`)**:
  - This flow receives real-time sensor readings for a zone.
  - It uses a "hyper-vigilant" AI persona that is prompted to *always* find 3-4 opportunities for improvement, even when conditions are optimal. This ensures the "Recommended Actions" list is never empty.
  - The AI suggests specific, actionable recommendations (e.g., "Activate HVAC Unit B-3") and provides a priority, ETA, expected impact, and an appropriate icon for the UI.

- **Emergency Alert Generation (`send-emergency-alert.ts`)**:
  - For the manual alert feature, this flow takes a user's custom message and target zone.
  - It prompts the AI to generate a professional email subject line and body content suitable for an emergency, which is then returned to the UI and simulated as "sent".

### 2. Frontend and UI

The user interface was built with a focus on creating a modern, data-rich dashboard experience.

- **Component Architecture**: The dashboard is broken down into reusable React components (e.g., `MetricCard`, `CampusMap`, `ZoneChart`) located in `src/components`. This makes the codebase modular and easy to maintain.
- **Real-time Data Simulation**: A custom React hook, `useCampusData` (in `src/lib/hooks.ts`), simulates live sensor data. It generates an initial set of historical data and then uses `setInterval` to push new, fluctuating data points every few seconds, creating a dynamic and realistic user experience.
- **Dashboard Pages**: The application features several pages:
    - **Overview**: A high-level view with a campus map and key statistics.
    - **Zone Analysis**: A detailed drill-down page for individual zones with trend charts, metric cards, and AI recommendations.
    - **Alert Management**: A central hub for viewing active, historical, and predicted alerts, as well as sending manual notifications.
    - **System Administration**: A control panel for managing users, system health, maintenance schedules, and alert configurations.

---

## Running Locally

To run this project on your local machine, follow these steps:

### 1. Set Up Environment Variables

You'll need a Google AI (Gemini) API key to run the AI-powered features.

1.  Create a new file named `.env.local` in the root of the project.
2.  Add your API key to this file:

    ```
    GEMINI_API_KEY="your-api-key-here"
    ```

    You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Install Dependencies

Open your terminal, navigate to the project's root directory, and run the following command to install the necessary packages:

```bash
npm install
```

### 3. Run the Development Servers

This project requires two separate development servers to be running at the same time in two different terminal windows.

*   **Terminal 1: Next.js App**
    This command starts the main frontend application.

    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:9002](http://localhost:9002).

*   **Terminal 2: Genkit AI Flows**
    This command starts the Genkit server that runs your AI flows and watches for any changes.

    ```bash
    npm run genkit:watch
    ```

## Deploying to Firebase

To deploy your application and make it publicly available, you can use Firebase App Hosting.

1.  **Install the Firebase CLI** if you haven't already:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase**:
    ```bash
    firebase login
    ```
    This will open a browser window for you to log in to your Google account.

3.  **Initialize Firebase in your project**:
    ```bash
    firebase init
    ```
    - When prompted, select **App Hosting**.
    - Follow the on-screen instructions to select your Firebase project.

4.  **Deploy your app**:
    ```bash
    firebase deploy
    ```

After the deployment is complete, the Firebase CLI will give you a public URL where you can see your live web app. It will look something like `https://your-project-id.web.app`.

## Publishing to GitHub

To publish your project to a new GitHub repository, follow these steps:

1.  **Initialize a Git repository** in your project folder:
    ```bash
    git init -b main
    ```

2.  **Add all files to staging**:
    ```bash
    git add .
    ```

3.  **Create your first commit**:
    ```bash
    git commit -m "Initial commit"
    ```

4.  **Create a new repository on GitHub**. Go to [github.com/new](https://github.com/new) and create a new repository. Do *not* initialize it with a README or .gitignore, as you already have those.

5.  **Link your local repository to the one on GitHub**:
    Replace `<Your-GitHub-Username>` and `<Your-Repository-Name>` with your actual details.
    ```bash
    git remote add origin https://github.com/<Your-GitHub-Username>/<Your-Repository-Name>.git
    ```

6.  **Push your code to GitHub**:
    ```bash
    git push -u origin main
    ```

Now your project is live on GitHub!
