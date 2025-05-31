<p align="center">
  <img src="public/images/logo.png" alt="NIStego Logo" width="150" />
</p>

<h1 align="center">NIStego</h1>

<p align="center">
  <em>"What if your educational journey was as intelligently designed as the knowledge you seek?"</em>
</p>

<p align="center">
  <b>AI-Powered Educational Progress Tracking for the Modern Student</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-v18-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-v5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-v10-orange?style=flat-square&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-v6-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Zustand-v4-brown?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/Framer_Motion-v11-ff69b4?style=flat-square&logo=framer" alt="Framer Motion" />
</p>

<br />

<p align="center">
  <img src="public/images/mockup-dashboard.png" alt="NIStego Dashboard" width="80%" style="border-radius: 10px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);" />
</p>

## 🌟 The Vision

In a world where education is still measured by centuries-old metrics, **NIStego** emerges as the bridge between traditional learning and cutting-edge technology. We believe that every student deserves a personalized educational experience that adapts to their unique learning style, pace, and goals.

NIStego isn't just another educational tool—it's your intelligent companion throughout your academic journey, transforming raw data into actionable insights and turning ambitions into achievements.

## ✨ Core Philosophy

- **Personalization**: No two students are alike. Why should their educational tools be?
- **Intelligence**: AI that works for you, not the other way around
- **Transparency**: Clear visualization of progress and goals
- **Empowerment**: Putting students in control of their educational destiny

## 🚀 Feature Constellation

### 📸 Visual Grade Recognition
Transform your paper grades into digital data with a simple snap. Our advanced computer vision algorithms extract and categorize your grades with remarkable precision.

```typescript
// Behind the scenes, our ML model processes your grades
const processGradeImage = async (imageData: Blob): Promise<GradeData[]> => {
  const model = await loadMLModel('grade-recognition-v2');
  return model.predict(imageData);
};
```

### 🎯 Curriculum Objectives & Learning Goals
Set SMART goals with AI assistance that aligns with your curriculum:

- **Specific**: Tied directly to curriculum objectives
- **Measurable**: Clear progress tracking with visual feedback
- **Achievable**: Broken down into manageable tasks
- **Relevant**: Connected to your subjects and interests
- **Time-bound**: Intelligent scheduling based on your availability

### 📊 Multi-dimensional Progress Tracking
Track your academic journey through:

- **Heatmap Visualization**: See your productivity patterns
- **Progress Rings**: Quick visual feedback on goal completion
- **Subject Breakdown**: Identify strengths and areas for improvement
- **Time Analysis**: Optimize your study schedule

### 🧠 Smart Planner with AI Insights
Let our AI analyze your study patterns and suggest optimal plans:

- **Natural Language Processing**: Add tasks using everyday language
- **Intelligent Task Parsing**: Automatically extracts subjects, dates, and priorities
- **Workload Balancing**: Prevents overloading specific days
- **Adaptive Scheduling**: Learns from your completion patterns

### 🌐 Comprehensive Learning Ecosystem
NIStego isn't just a planner—it's a complete educational companion:

- **Mini-Lessons**: Bite-sized content to reinforce concepts
- **Practice Questions**: Test your knowledge with adaptive difficulty
- **Error Tracking**: Identify and address misconceptions
- **Subject Integration**: Seamlessly connects across all your courses

## 💻 Technical Architecture

NIStego is built on a modern, scalable tech stack designed for performance and extensibility:

### Frontend Architecture
```
src/
├── components/         # Reusable UI components
│   ├── common/         # Shared components
│   ├── goals/          # Curriculum objectives components
│   ├── planner/        # Planning and scheduling components
│   └── grades/         # Grade visualization components
├── pages/              # Application pages/routes
├── services/           # API and third-party service integrations
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

### State Management
We use Zustand for efficient, hook-based state management with persistence:

```typescript
// Example of our goals store
const useGoalsStore = create<GoalsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State and actions for curriculum objectives
        objectives: [],
        selectedObjective: null,
        
        // Actions
        setObjectives: (objectives) => set({ objectives }),
        openObjectiveModal: (objectiveCode) => set({ 
          selectedObjective: objectiveCode,
          isObjectiveModalOpen: true 
        }),
        
        // Computed values
        getFilteredObjectives: () => {
          // Logic for filtering objectives
        }
      }),
      { name: 'goals-storage' }
    )
  )
);
```

### Data Flow
1. **User Interaction** → React Components
2. **State Changes** → Zustand Stores
3. **API Calls** → Service Layer
4. **Data Processing** → Utility Functions
5. **Rendering** → React Components with Framer Motion animations

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

# Build for production
npm run build

# Run tests
npm test
```

## 📱 Responsive Experience

NIStego adapts fluidly to all devices with a thoughtful, responsive design:

- **Mobile**: Optimized touch interfaces and compact layouts
- **Tablet**: Enhanced interactions for medium-sized screens
- **Desktop**: Full-featured experience with advanced visualizations
- **Dark/Light Modes**: Automatically adapts to system preferences or manual selection

## 🔮 Future Horizons

Our development roadmap includes:

- **AI Tutor**: Personalized explanations based on your learning patterns
- **Peer Learning Networks**: Connect with students sharing similar goals
- **AR Grade Scanning**: Point your camera at a grade and see it instantly digitized
- **Voice Commands**: Manage your educational journey hands-free
- **Learning Style Adaptation**: Content that adapts to your preferred learning style

## 🛠️ For Developers

### Key Dependencies
- **React 18**: For building the user interface
- **TypeScript**: For type safety and developer experience
- **Firebase**: For backend services and authentication
- **Zustand**: For state management
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations
- **Day.js**: For date manipulation
- **React Router**: For navigation

### Contribution Guidelines
We welcome contributions from developers of all experience levels:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🤝 Community & Support

- **Discord**: Join our developer community
- **Documentation**: Comprehensive guides and API references
- **Issue Tracker**: Report bugs and request features
- **Blog**: Stay updated with our development journey

## 📄 License

NIStego is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- NIS School System for curriculum insights
- Our dedicated beta testers and early adopters
- The open-source community for invaluable tools and libraries
- Educational experts who guided our pedagogical approach

<p align="center">
  <b>NIStego: Where Technology Meets Education</b><br>
  <em>Own Your Progress, Shape Your Future</em>
</p>

<p align="center">
  <a href="https://twitter.com/nistego">Twitter</a> •
  <a href="https://instagram.com/nistego.app">Instagram</a> •
  <a href="https://github.com/Danchouvzv/nistego">GitHub</a>
</p>
