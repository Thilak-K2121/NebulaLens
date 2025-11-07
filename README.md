# 🔭 NebulaLens: AI-Powered Cosmic Classifier

**NebulaLens** is a full-stack web application that doesn't just *classify* celestial objects—it *explains* them. Using a hybrid system of four scikit-learn models and the Gemini generative AI, this tool provides a deep, interactive dashboard for analyzing and understanding cosmic data.

This project goes beyond a simple input-output model to provide a full "what-if" analysis tool, an anomaly detector for unusual objects, and dynamic, AI-generated explanations for its reasoning.

---

## ✨ Key Features

NebulaLens is built as an "AI-on-AI" system, where machine learning models make predictions and a generative AI model provides context and analysis.

### 🔮 Machine Learning & Prediction
* **Multi-Model Comparison:** Feeds user inputs to four distinct models (**Random Forest, SVM, MLP, KNN**) and displays their individual confidence scores.
* **Model Agreement:** Calculates a "Consensus Result" (e.g., "3 out of 4 models agree") for a more robust prediction.
* **Interactive "What-If" Sliders:** A powerful sensitivity analysis tool. Users can drag sliders for all 6 features (u, g, r, i, z, redshift) and re-run predictions to see how models react to different values.
* **Prediction History Log:** Every prediction is added to a session log, allowing users to compare the results of their "what-if" experiments.
* **Load Example Data:** Instantly populate the form with real-world data for a **Star**, **Galaxy**, or **QSO**.

### 🤖 Gemini AI-Powered Insights
* **Dynamic AI Explanation (XAI):** After a prediction, Gemini generates a custom, human-readable explanation of *why* the models reached their conclusion, based on the user's *specific* input values (e.g., "This prediction makes sense because the `redshift` (1.9) is very high...").
* **Anomaly Detector:** If the models' average confidence is low (<60%), the UI flags the object as an "Anomaly." The user can then ask Gemini to *hypothesize* what this rare or unusual object might be.
* **Astro-Pedia:** A "Learn More" button that asks Gemini to provide a simple, encyclopedic definition of the predicted object (e.g., "What is a Quasar?").
* **Streaming Typewriter Effect:** All AI-generated responses are streamed to the UI with a typewriter effect, creating a more "live" and engaging feel.

### 📊 Advanced Data Visualization
* **Model Profile Radar Chart:** A "spider chart" that visualizes the "personality" of all four models, comparing them across **Accuracy, Precision, Recall, and F1-Score** on a single graph.
* **Feature Importance Chart:** A bar chart showing which of the 6 features (like `redshift` or `u`-filter) had the most impact on the models' decisions.
* **PDF/HTML Report Generation:** A "Export as PDF" button on the `Visualizer` page that generates a clean, print-friendly report of all charts.
* **Responsive UI:** Built with Tailwind CSS, the interface is fully responsive, from the fade-in animations to the component layout.

---

## 🏗 Project Architecture

The application runs on a decoupled, full-stack architecture.



[Image of a full-stack web application architecture diagram]


1.  **Frontend (React):** The user interacts with the UI. All API calls are sent to the FastAPI backend.
2.  **Backend (FastAPI):**
    * Receives the 6 raw input features from the user.
    * Loads the `star_classifier_scaler.joblib` to scale the inputs.
    * Feeds the scaled data into all 4 `.joblib` ML models.
    * Calls `predict_proba()` to get confidence scores.
    * Analyzes the scores to determine the consensus and check for anomalies.
3.  **Gemini API (Securely Called):**
    * The backend *securely* calls the Gemini API with its hidden API key.
    * It sends detailed prompts for dynamic XAI, anomaly analysis, or simple explanations.
4.  **JSON Response:** The backend packages all data (predictions, probabilities, anomaly flags, Gemini text) into a single JSON object and sends it back to the React frontend for rendering.

---

## 🛠 Tech Stack

### 🐍 Backend
* **Python 3.10+**
* **FastAPI:** For the high-performance, async-ready API.
* **Scikit-learn:** For loading and using the ML models.
* **Joblib:** For deserializing the `.joblib` model and scaler files.
* **Google Generative AI (`google-generativeai`):** For all generative AI features.
* **Uvicorn:** As the ASGI server.
* **Python-Dotenv:** For managing environment variables.

### ⚛️ Frontend
* **React 18** (with **Vite**)
* **Tailwind CSS:** For all styling and the responsive layout.
* **Chart.js (`react-chartjs-2`):** For all data visualizations (Bar, Radar).
* **Axios:** For making API requests to the backend.
* **React Router (`react-router-dom`):** For page navigation.

---

## 🚀 Getting Started

You'll need two terminals to run this project.

### Prerequisites
* **Node.js** (v18 or later)
* **Python** (v3.10 or later)
* A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Backend Setup

1.  **Navigate to the `backend` folder:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Windows
    python -m venv .venv
    .\.venv\Scripts\activate
    
    # macOS / Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install the required Python packages:**
    ```bash
    pip install fastapi uvicorn scikit-learn "joblib==1.4.2" fastapi-cors google-generativeai python-dotenv
    ```

4.  **🔒 Add your API Key (CRITICAL):**
    * Create a file named `.env` inside the `backend` folder.
    * Add your API key to this file:
        ```ini
        GEMINI_API_KEY=your_actual_api_key_goes_here
        ```

5.  **Place the models:**
    * Ensure your 5 essential `.joblib` files (which you received from your friend) are in the `backend/models/` folder:
    * `model_rf.joblib`
    * `model_svm.joblib` (Must be trained with `probability=True`)
    * `model_mlp.joblib`
    * `model_knn.joblib`
    * `star_classifier_scaler.joblib`

6.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The API will now be running at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1.  **Open a *second* terminal** and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The React application will open in your browser at `http://localhost:5173`.

---

## 🔒 Security & `.gitignore`

This project uses a `.gitignore` file in the **root directory** to protect your secret API key and ignore unnecessary files.

**It is critical that your `.gitignore` file contains `backend/.env` to prevent your key from being uploaded to GitHub.**

### `.gitignore` contents:
```ini
# --- CRITICAL SECRET FILE ---
# Prevents your Gemini API Key from being uploaded
backend/.env

# --- PYTHON & BACKEND ---
backend/.venv/
__pycache__/
*.pyc

# --- NODE & FRONTEND ---
frontend/node_modules/
frontend/dist/
frontend/.env.local
frontend/.env.*.local

# --- OS & EDITOR JUNK ---
.DS_Store
Thumbs.db
.vscode/
.idea/
npm-debug.log*
yarn-error.log*
