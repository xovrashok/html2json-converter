# HTML to JSON Converter — Jito Test Task

This repository contains an implementation of a custom HTML-to-JSON parser without using the browser DOM parser or external parsing libraries, as required by the assignment guidelines.

## 📂 Repository Structure

- `html2json.js` — Core parsing logic (`html2json` and helper functions). Isolated from DOM dependencies.
- `app.js` — UI event handlers for `index.html` (separated to maintain clean architectural boundaries).
- `index.html` — The provided web interface for testing conversions and viewing examples.
- `html_samples/` — Test files containing various HTML scenarios used during development and testing.
- `ai_help/` — Contains `chatgpt_chat.txt` with a link to the complete AI interaction history.

---

## 🛠️ Design & Architecture Choices

### 1. Separation of Concerns

To keep the parsing algorithm unit-testable and environment-agnostic, the UI interactions (`convertHtml2JsonAndSet`, `showExample1`, `showExample2`) were moved to `app.js`. The main `html2json.js` file contains strictly pure conversion logic without DOM dependencies, making `html2json` globally available for `app.js`.

### 2. Tokenization & Stack-Based Processing

Since the DOM parser is prohibited, the solution uses a two-phase approach:

- **Tokenization:** Uses an enhanced Regex-based matcher (`/(<[^"'>]+(?:["'][^"']*["'][^"'>]*)*>)|([^<]+)/g`) to safely split raw clean HTML into distinct tags and text nodes without breaking on `>` characters inside attribute strings.
- **Tree Construction (Stack):** Iterates over tokens using an explicit stack (`stack = [root]`) to maintain parent-child hierarchy and nested structures without recursion limits.

### 3. Handling Self-Closing / Void Elements

HTML defines specific "void elements" (e.g., `<img>`, `<input>`, `<meta>`, `<br>`, `<link>`) that do not require closing tags. A predefined `VOID_ELEMENTS` `Set` ensures these nodes are not pushed onto the stack, preventing broken nested hierarchies.

### 4. Attribute Parsing

Attributes are extracted into a key-value object using Regex matching (`/([a-zA-Z0-9:-]+)(?:=(?:["']([^"']*)["']|([^\s>]+)))?/g`), correctly capturing:

- Standard quoted attributes (`id="main"`, `class='btn'`).
- Unquoted attribute values (`value=123`).
- Boolean attributes without explicit values (`required`, `disabled`).

---

## 🛡️ Edge Cases & Crash Prevention

The code was designed with the **"MUST NOT crash"** requirement in mind:

1. **Empty / Invalid Input:** Returns an empty array `[]` if input is `null`, `undefined`, empty, or a non-string type.
2. **Doctype & Comments:** Strips `<!DOCTYPE>` and comments (`<!-- ... -->`) before tokenization to keep output trees clean.
3. **Whitespace Normalization:** Removes excessive line breaks and formats inline whitespace without trimming spaces inside actual text content.
4. **Mismatched / Unclosed Tags:** The stack gracefully pops or appends orphan nodes without throwing runtime exceptions.

---

## 🧪 Testing & Samples (`html_samples/`)

The parser was verified against the sample files located in the `html_samples/` directory:

- `sample1.html` — Standard full web page document (head, body, navigation, sections).
- `sample2.html` — Interactive inputs, form controls, and inline elements.
- `sample3_complex_attributes.html` — Custom data attributes, void elements, unquoted values, and boolean flags.
- `sample4_nested_content.html` — Deeply nested markup with mixed text and inline tags.
- `sample5_edge_cases.html` — Comments, DOCTYPE declarations, scripts, and empty elements.

---

## 🚀 How to Run

1. Clone or extract the repository.
2. Open `index.html` in any web browser.
3. Click **"Input Example 1"** or **"Input Example 2"** to load HTML samples.
4. Click **"Convert to JSON"** to process the HTML into JSON format.
