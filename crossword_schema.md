# NeonCross Crossword JSON Schema & GPT Integration Guide

This guide explains how to format crossword puzzle data as JSON for **NeonCross Premium Crossword Studio**. It includes the schema specifications, robust formats, example payloads, and a copy-pasteable prompt template to configure a **Custom GPT** or assist a language model in generating fully compatible crossword files.

---

## 1. Schema Specifications

NeonCross supports three distinct JSON configurations, ordered from the most feature-rich to the most minimal. When importing, NeonCross automatically recognizes the schema structure and sets up the canvas configuration and word lists instantly.

### Format A: Full Standard Schema (Recommended)
This format allows control over the grid size, generation quality (optimization attempts), a title, a description, and the full word-clue mapping.

```json
{
  "title": "Technology & Web Dev",
  "description": "A premium puzzle covering web technologies, databases, and scripting languages.",
  "gridSize": 20,
  "attempts": 50,
  "words": [
    {
      "word": "HTML",
      "clue": "Markup language for structural layout on the web"
    },
    {
      "word": "CSS",
      "clue": "Stylesheets used to describe the web's visual presentation"
    },
    {
      "word": "JAVASCRIPT",
      "clue": "The universal scripting language of modern browsers"
    }
  ]
}
```

#### Properties Breakdown
* **`title`** *(string, optional)*: The title of the crossword puzzle.
* **`description`** *(string, optional)*: A short description summarizing the theme or educational goal of the puzzle.
* **`gridSize`** *(integer, optional)*: The maximum grid dimensions (between `10` and `30`). Defaults to `20`.
* **`attempts`** *(integer, optional)*: The layout placement optimization attempts (between `10` and `100`). Higher values yield cleaner intersections. Defaults to `50`.
* **`words`** *(array of objects, required)*: The list of word pairs.
  * **`word`** *(string, required)*: The answer word. Must be alphabetic characters only (A-Z). Spaces and numbers are stripped on import. Length must be $\ge 2$ characters.
  * **`clue`** *(string, required)*: The descriptive clue presented to the player.

---

### Format B: Flat List of Objects (Fallback)
A simpler list format that focuses exclusively on the words and clues. Custom grid configurations will fallback to the current UI settings.

```json
[
  {
    "word": "COMPILER",
    "clue": "Translates high-level source code into binary machine code"
  },
  {
    "word": "DATABASE",
    "clue": "An organized, queryable collection of structured data"
  }
]
```

---

### Format C: List of Arrays (Fallback)
An ultra-minimal representation mapping perfectly to standard key-value arrays.

```json
[
  ["ALGORITHM", "A step-by-step logic routine to perform calculations"],
  ["FRONTEND", "The client-facing UI part of a web application"]
]
```

> [!NOTE]
> **Dynamic Compilation & Layout Preservation:** The imported JSON configurations define the crossword vocabulary and settings, which NeonCross will dynamically compile into a puzzle upon import. If you wish to preserve and share a **specific frozen board layout** with identical word positions and intersections, use the **Copy Play Link** or **Copy Edit Link** features in the sidebar. These generate custom URLs encoding the absolute board coordinate states.

---

## 2. GPT System Prompt Instructions

Copy and paste the prompt template below into the **System Instructions** or **Developer Prompt** of your Custom GPT or ChatGPT window. This guarantees the model outputs clean, well-validated JSON puzzles matching the Standard Schema.

```text
You are a premium Crossword Generation Engine designed to create educational, structured crossword puzzles in a strict JSON format for "NeonCross Premium Crossword Studio".

Your goal is to receive a theme, topic, or word count from the user and output a valid, well-formed JSON object containing words and clues.

### RULES FOR GENERATION:
1. ONLY return a valid JSON object matching the schema below. Do not wrap the JSON in conversational text, introductions, or explanations. Use the ```json ... ``` codeblock.
2. Words must contain ONLY alphabetic characters (A-Z). No spaces, hyphens, numbers, or special symbols are allowed inside the "word" values (e.g., use "WEBDVELOPER", not "WEB-DEVELOPER" or "WEB DEVELOPER").
3. Word length must be at least 2 characters, and ideally under 18 characters.
4. Clues must be descriptive, clever, clear, and grammatically correct.
5. Provide a minimum of 8 words and a maximum of 25 words to ensure a compact, highly-interconnected crossword grid can be generated.
6. Automatically select an appropriate gridSize (between 12 and 24 depending on word lengths) and attempts count (between 40 and 70).

### JSON SCHEMA TEMPLATE:
{
  "title": "[Insert an engaging title based on the theme]",
  "description": "[Insert a brief description of the puzzle topic]",
  "gridSize": [Integer between 12 and 25],
  "attempts": 60,
  "words": [
    {
      "word": "[WORD1 IN UPPERCASE]",
      "clue": "[Clue explaining word 1]"
    },
    ...
  ]
}

### EXAMPLE PROMPT RESPONSE:
If the user asks for a "cooking" theme, output:
```json
{
  "title": "Culinary Delights",
  "description": "Test your knowledge of baking, kitchen tools, and gourmet techniques.",
  "gridSize": 18,
  "attempts": 50,
  "words": [
    {
      "word": "SPAGHETTI",
      "clue": "Long, thin, solid cylindrical wheat pasta lines"
    },
    {
      "word": "CROISSANT",
      "clue": "Buttery, flaky, crescent-shaped French pastry bread"
    },
    {
      "word": "ESPRESSO",
      "clue": "Strong, concentrated black coffee brewed under pressure"
    }
  ]
}
```
```

---

## 3. Example JSON Puzzles

### Example 1: Astronomy Theme (`space.json`)
```json
{
  "title": "Wonders of the Cosmos",
  "description": "Explore planets, stars, and cosmic phenomena in this celestial challenge.",
  "gridSize": 20,
  "attempts": 60,
  "words": [
    { "word": "SUPERNOVA", "clue": "A massive stellar explosion of colossal luminous energy" },
    { "word": "GALAXY", "clue": "A gravitationally bound system of stars, dust, and gas" },
    { "word": "NEBULA", "clue": "An interstellar cloud of dust, hydrogen, and helium" },
    { "word": "TELESCOPE", "clue": "An optical instrument designed to view distant planets" },
    { "word": "JUPITER", "clue": "The largest gas giant planet in our Solar System" },
    { "word": "GRAVITY", "clue": "The natural force attracting bodies toward planetary center" }
  ]
}
```

### Example 2: Medical Biology Theme (`biology.json`)
```json
{
  "title": "Human Biology & Anatomy",
  "description": "An educational overview of cells, systems, and structures of the human body.",
  "gridSize": 16,
  "attempts": 50,
  "words": [
    { "word": "MITOCHONDRIA", "clue": "The powerhouses of the cell that generate chemical energy" },
    { "word": "CYTOPLASM", "clue": "The jelly-like fluid that fills a cell outside the nucleus" },
    { "word": "HEMOGLOBIN", "clue": "Iron-containing protein in red blood cells that transports oxygen" },
    { "word": "SYNAPSE", "clue": "The tiny junction across which nerve impulses pass between neurons" },
    { "word": "PLATELET", "clue": "Disc-shaped cell fragments in blood crucial for clotting" }
  ]
}
```

---

## 4. LLM Direct URL Link Scheme

If you want an LLM (such as a Custom GPT or ChatGPT) to generate clickable links that immediately load custom crossword puzzles directly in the browser, use the plain-text URL scheme below. This bypasses base64 encoding limits.

### URL Structure

```text
https://[your-app-domain]/crossword.html?words=[WORD1]:[Clue1]|[WORD2]:[Clue2]&gridSize=[Integer]&mode=[play|edit]
```

### Parameter Specifications

* **`words`** *(required)*: A list of `WORD:Clue` pairs. Each pair is separated by a vertical pipe `|` or a semicolon `;`. The word must contain alphabetic characters only, and the clue must be URL-encoded (e.g. spaces replaced by `%20` or `+`).
* **`gridSize`** / **`g`** *(optional)*: The grid size, between `10` and `30` (defaults to `20`).
* **`attempts`** / **`a`** *(optional)*: The compiler optimization attempts, between `10` and `100` (defaults to `50`).
* **`mode`** *(optional)*: The interface mode to load. 
  - Set to `play` to load in solving mode (solving toolbar available, left designer sidebar hidden).
  - Set to `edit` to load in designer mode (full sidebar editor available).
* **`new`** *(optional)*: Set `new=1` to immediately start a fresh, blank crossword workspace (`crossword.html?new=1`).

### Custom GPT Prompt Instructions

Append the following instructions to your Custom GPT system prompt if you want it to output direct clickable crossword links:

```text
When the user requests an interactive crossword link, generate it using the plain-text URL Link Scheme below:

Link Scheme Format:
[Click to play the puzzle!](https://[your-app-domain]/crossword.html?words=WORD1:Clue%20One|WORD2:Clue%20Two|WORD3:Clue%20Three&gridSize=15&mode=play)

Guidelines:
1. URL-encode the clues (replace spaces with %20 and special characters properly).
2. Separate each word-clue pair with a vertical pipe (|).
3. Use mode=play for a ready-to-solve game, or mode=edit if they want to edit the word list.
```
