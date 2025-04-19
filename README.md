# Project Name

A brief description of what this project does and who it's for.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/victoradhikary/perplexcity_clone.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

This project uses environment variables to store sensitive API keys. Do **not** commit your `.env` file to Git.

1. Create a `.env` file in the project root:
   ```bash
   touch .env
   ```

2. Add your API keys to `.env` (replace the placeholder values with your actual keys):
   ```dotenv
   VITE_GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key
   VITE_TAVILY_API_KEY=your-tavily-api-key
   ```

3. Ensure `.env` is ignored by Git by including it in your `.gitignore`:
   ```gitignore
   # Environment Variables
   .env
   ```

## Usage

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port specified in the console).

## Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Folder Structure

```text
.
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # React/Vue/Svelte components
│   ├── pages/          # Page components or routes
│   ├── styles/         # CSS or SCSS files
│   └── main.js         # App entry point
├── .env                # Environment variables (local only)
├── .gitignore          # Ignored files
├── package.json        # npm scripts and dependencies
└── README.md           # This file
```

## Contributing

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

---

*Feel free to customize this README to fit your project details.*

