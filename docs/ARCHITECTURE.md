# RootSight V3: Technical Architecture

This document outlines the technical design and execution flow of the RootSight V3 incident intelligence pipeline.

## 1. System Overview

RootSight is composed of a FastAPI backend and a Next.js frontend. The core value lies in the **Orchestration Pipeline**, which processes incident triggers into actionable intelligence.

## 2. Pipeline Execution Flow

The pipeline follows a sequential execution model with intermediate state storage in SQLite:

1.  **Trigger (`trigger_service`)**: Receives a webhook (PagerDuty, Datadog) or a manual signal. Creates an `Incident` record.
2.  **Ingestion (`ingestion_service`)**: Samples logs (max 100 lines) relevant to the incident window.
3.  **Timeline Reconstruction (`timeline_module`)**:
    - **Input**: Raw log samples.
    - **LLM**: Gemini 2.0 Flash.
    - **Output**: Chronological list of `Events` with confidence scores.
4.  **RCA Generation (`rca_module`)**:
    - **Input**: Reconstructed timeline + logs.
    - **LLM**: Gemini 2.0 Flash.
    - **Output**: Ranked `Hypotheses` with supporting/counter evidence.
5.  **Impact Assessment (`impact_module`)**:
    - **Input**: Timeline + RCA.
    - **Output**: Assessment of business and user impact.
6.  **Memory Retrieval (`memory_module`)**:
    - **Input**: RCA Hypotheses.
    - **Tool**: FAISS + Gemini Embeddings.
    - **Output**: Top 3 similar historical incidents.
7.  **Action Generation (`action_module`)**:
    - **Input**: All previous stages.
    - **LLM**: Groq (Llama 3.1).
    - **Output**: Drafts for Slack and Jira.

## 3. Data Models (Simplified)

### Incident
- `id`: UUID
- `title`: String
- `status`: Enum (PENDING, RUNNING, COMPLETED, FAILED)
- `severity`: Enum (LOW, MEDIUM, HIGH, CRITICAL)

### Event
- `timestamp`: DateTime
- `description`: String
- `confidence`: Float (0.0 - 1.0)
- `source_log`: String (Reference)

### Hypothesis
- `title`: String
- `description`: String
- `confidence`: Float
- `evidence`: List[String]

## 4. State Management

- **Backend**: SQLModel (SQLite) for persistent storage of incidents and pipeline results.
- **Frontend**: React hooks and API polling for real-time dashboard updates.

## 5. Security & Privacy

- **No Raw Storage**: Raw logs are processed in-memory and never stored in the database. Only summaries and extracted evidence are persisted.
- **Local FAISS**: Vector embeddings are stored locally, ensuring incident history remains on-premise/in-private-cloud.
