# AI Coaching Workflow

## 1. Biomechanical Vision Analysis

The core of X10Minds is the vision-based form analysis.

**Input**: User photo (Drawing position).
**Process**:

- Convert file to Base64.
- Send to `gemini-2.5-flash` with internal biomechanics prompt.
- Model identifies joint positions and alignment lines.
  **Output**: Overlay coordinates and a structured textual report.

## 2. Dynamic SPT Generation

Specific Physical Training (SPT) is crucial for archery strength.

**Input**: Muscle Group + Difficulty Level.
**Process**:

- Prompt Gemini with constraints (10-30 exercises, specific categories).
- Set `responseMimeType` to `application/json`.
- Validate JSON schema on arrival.
  **Output**: Automated тренировка (workout) with timers and instructions.

## 3. Multimodal Chat Interaction

The AI Coach acts as a knowledgeable mentor.

**Capabilities**:

- Memory of previous sessions.
- Ability to "see" current form.
- Scientific understanding of archery physics (FOC, spine, paradox).
- Motivational protocol (personalized compliments, growth tracking).
