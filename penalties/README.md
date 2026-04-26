# Penalty Shootout Question Sets

This folder contains the Penalty Shootout vocabulary game. The reusable question editor and shared sample library now live in the top-level `editor/` folder.

## Game

Open:

```text
index.html
```

The game uses JSON question sets with 4 to 50 valid questions. Each round chooses one question and creates four answer choices automatically:

- 1 correct answer
- 3 random distractors from the same question set

Distractors do not need to be written manually.

## Shared Editor

Open:

```text
../editor/index.html
```

The editor starts with a blank set. You can:

- add questions
- edit questions
- delete questions
- load an existing JSON file
- load a built-in sample set
- save your set as a JSON file
- send the current set back to the game with **Back to Game**

The editor reminds users to save a JSON file before returning to the game. Sending a set back to the game uses browser storage, so downloading JSON is still the permanent copy.

## JSON Format

Each question should use this shape:

```json
{
  "word": "algorithm",
  "definition": "A step-by-step method for solving a problem or completing a task.",
  "clue": "Often written before coding begins.",
  "explanation": "An algorithm describes the logical steps needed to solve a problem."
}
```

Full file format:

```json
{
  "metadata": {
    "title": "Example Set",
    "total_questions": 4,
    "format": "flat"
  },
  "questions": []
}
```

Required fields:

- `word`
- `definition`

Optional fields:

- `clue`
- `explanation`

## Limits

- Minimum questions for the game: 4
- Maximum questions loaded or saved for the game: 50

## Sample Sets

Built-in sample sets are in:

```text
../editor/samples/
```

Current examples include:

- iGCSE Biology
- iGCSE Business Studies
- iGCSE Chemistry
- iGCSE Computing
- iGCSE Economics
- iGCSE Geography
- iGCSE History: Second World War
- iGCSE Physics
- iGCSE Psychology

The original vocabulary set is:

```text
penaltyshootout.json
```

## Shareable Links

You can share a ready-made set by adding a relative JSON path to the game URL:

```text
index.html?set=../editor/samples/igcse-computing-sample.json
```

Examples:

```text
index.html?set=../editor/samples/igcse-biology-sample.json
index.html?set=../editor/samples/igcse-history-ww2-sample.json
```

Only relative `.json` paths are allowed. External URLs are not loaded. Shared sample links should use `../editor/samples/`.
