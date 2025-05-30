# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

<p align="center">
  <img src="public/images/logo.png" alt="NIStego Logo" width="150" />
</p>

<h1 align="center">NIStego</h1>

<p align="center">
  <b>AI-Powered Educational Progress Tracking for Students</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-v18-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-v5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-v10-orange?style=flat-square&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-v6-646CFF?style=flat-square&logo=vite" alt="Vite" />
</p>

<br />

## ✨ Overview

NIStego is an intelligent educational companion designed specifically for NIS students to manage their academic journey with ease and precision. The platform combines AI-powered grade recognition with personalized goal setting and smart planning.

<p align="center">
  <img src="public/images/mockup-dashboard.png" alt="NIStego Dashboard" width="80%" />
</p>

## 🚀 Key Features

- **📷 Automated Grade Recognition** - Simply upload a photo of your grades, and our AI does the rest
- **🎯 SMART Goal Setting** - AI-assisted goal creation that's Specific, Measurable, Achievable, Relevant, and Time-bound
- **📊 Progress Visualization** - Track your academic journey with beautiful, intuitive charts
- **📅 Intelligent Scheduler** - AI-generated study plans based on your goals and availability
- **🌙 Dark/Light Mode** - Study comfortably day or night
- **🌐 Multilingual** - Full support for Kazakh, Russian, and English

## 🏗️ Tech Stack

NIStego leverages modern technologies to deliver a seamless experience:

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage, Analytics)
- **AI/ML**: Custom ML models for grade recognition and study planning
- **Tooling**: Vite, ESLint, PostCSS

## 🔧 Getting Started

```bash
# Clone the repository
git clone https://github.com/Danchouvzv/nistego.git

# Navigate to project directory
cd nistego

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📱 Responsive Design

NIStego is meticulously crafted for all devices:

- 📱 Mobile-first approach
- 💻 Tablet and desktop optimized
- 📊 Responsive dashboards and visualizations

## 🔮 Future Roadmap

- **🧠 AI Study Assistant** - Personalized learning recommendations
- **👥 Peer Collaboration** - Connect with classmates for group study
- **🔔 Smart Notifications** - Timely reminders for upcoming deadlines
- **📊 Advanced Analytics** - Deeper insights into learning patterns

## 🤝 Contributing

We welcome contributions from everyone! Check out our [contribution guidelines](CONTRIBUTING.md) to get started.

## 📄 License

NIStego is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- NIS School System for inspiration
- Our dedicated beta testers
- The amazing open-source community

<p align="center">
  <b>Own Your Progress</b>
</p>
