# The Daily Harvest

A modern TypeScript-based shopping website built with React and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the eCommApp directory:
   ```bash
   cd eCommApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`


## Deploy com Docker

O projeto pode ser executado em um container Docker sem instalar Node.js na máquina local. O processo utiliza Node.js para compilar o frontend e Nginx para publicar os arquivos de produção.

### Pré-requisitos

- Docker instalado
- Docker Compose disponível

### Executar o projeto

Na pasta `eCommApp`, execute:

```bash
docker compose up --build -d


## 📁 Project Structure

```
eCommApp/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
