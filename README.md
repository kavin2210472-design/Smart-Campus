# EcoWatch Campus - Smart Environmental Monitoring

This is a Next.js application built in Firebase Studio. It's a dashboard for real-time environmental monitoring, featuring predictive AQI alerts and AI-driven corrective action suggestions.

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
