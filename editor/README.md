# Shared Question Editor

This folder contains the reusable JSON question editor and shared sample question sets.

Open:

```text
index.html
```

Sample sets live in:

```text
samples/
```

The editor uses the shared question-set format:

```json
{
  "metadata": {
    "title": "Example Set",
    "total_questions": 4,
    "format": "flat"
  },
  "questions": [
    {
      "word": "algorithm",
      "definition": "A step-by-step method for solving a problem.",
      "clue": "Optional hint",
      "explanation": "Optional feedback after answering."
    }
  ]
}
```

Games can load these files directly as long as they understand:

- `word` as the answer
- `definition` as the prompt
- `clue` as an optional hint
- `explanation` as optional feedback

The editor can send a set back to the Penalty Shootout game through browser storage, but users should still use **Save JSON** for a permanent copy.
