# Shared Question Editor

This folder contains the reusable JSON question editor and shared sample question sets.

Open:

```text
../editor.html
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

## Direct Game Links

You can launch the Penalty Shootout game directly with a specific question set by appending `?set=PATH` to the game URL.

**Base URL:** `../penalties.html`

### Sample Set Links:

- **General Vocabulary:** [Launch Game](../penalties.html?set=penalties/penaltyshootout.json)
- **iGCSE Biology:** [Launch Game](../penalties.html?set=editor/samples/igcse-biology-sample.json)
- **iGCSE Business Studies:** [Launch Game](../penalties.html?set=editor/samples/igcse-business-studies-sample.json)
- **iGCSE Chemistry:** [Launch Game](../penalties.html?set=editor/samples/igcse-chemistry-sample.json)
- **iGCSE Computing (General):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-sample.json)
- **iGCSE Computing (Data Representation):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-data-representation.json)
- **iGCSE Computing (Data Transmission):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-data-transmission.json)
- **iGCSE Computing (Hardware):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-hardware.json)
- **iGCSE Computing (Software):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-software.json)
- **iGCSE Computing (Internet):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-internet.json)
- **iGCSE Computing (Databases):** [Launch Game](../penalties.html?set=editor/samples/igcse-computing-databases.json)
- **iGCSE Economics:** [Launch Game](../penalties.html?set=editor/samples/igcse-economics-sample.json)
- **iGCSE Geography:** [Launch Game](../penalties.html?set=editor/samples/igcse-geography-sample.json)
- **iGCSE History (WW2):** [Launch Game](../penalties.html?set=editor/samples/igcse-history-ww2-sample.json)
- **iGCSE Physics:** [Launch Game](../penalties.html?set=editor/samples/igcse-physics-sample.json)
- **iGCSE Psychology:** [Launch Game](../penalties.html?set=editor/samples/igcse-psychology-sample.json)
