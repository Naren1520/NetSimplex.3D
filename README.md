# NetSimplex.3D

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Built with React](https://img.shields.io/badge/built%20with-React%2019-61dafb)
![Powered by Google Gemini](https://img.shields.io/badge/powered%20by-Google%20Gemini%203.7%20Flash-orange)

## Overview

**NetSimplex.3D** is an advanced interactive 3D network topology visualization and simulation platform designed for educational purposes. This tool provides immersive learning experiences for understanding complex network architectures, including server-centric and information-centric networking paradigms.

The application enables users to visualize network topologies in real-time, simulate data packet transmission, analyze network behavior, and debug network operations through an intuitive 3D interface. It combines cutting-edge web technologies with AI-powered insights to create a comprehensive learning environment.

## 🎓 Educational Purpose

This project is **explicitly designed for educational use**. It is intended to help students, researchers, and professionals understand:

- **Network Topology Visualization**: Explore complex network structures in 3D space
- **Data Packet Simulation**: Watch how data flows through networks in real-time
- **Architecture Comparison**: Compare different networking paradigms (Server-Centric vs Information-Centric)
- **Network Debugging**: Analyze network behavior with detailed execution tracing
- **Architectural Patterns**: Learn core principles of network design and implementation

Whether you're a computer science student, network engineer, or technology educator, NetSimplex.3D provides an engaging platform to learn and experiment with networking concepts.

## ✨ Features

- **3D Network Topology Visualization**: Interactive real-time rendering of network nodes and connections
- **Multiple Architecture Modes**:
  - Server-Centric Architecture (Traditional client-server model)
  - Information-Centric Architecture (Content-focused networking)
- **Simulation Controls**: Play, pause, and step through network simulations
- **Real-time Data Packet Visualization**: See packets flowing through the network
- **Network Debugger**: Execute and trace network operations with detailed logs
- **Virtual Client Browser**: Simulate client behavior and responses
- **Architectural Analysis**: Deep dive into network structure and performance metrics
- **Responsive Design**: Optimized for desktop environments with Tailwind CSS
- **Dark/Light Theme Support**: Comfortable viewing in any environment

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.0.1
- **3D Graphics**: Three.js (v0.185.1)
- **Build Tool**: Vite 6.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini 3.7 Flash (via @google/genai v2.4.0)
- **Animations**: Motion (v12.23.24)
- **UI Components**: Lucide React Icons
- **Backend**: Express.js 4.21.2 (for server operations)
- **Node Runtime**: ES Module support

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Google Gemini API Key**: Required for AI-powered features
  - Sign up at [Google AI Studio](https://aistudio.google.com)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Naren1520/NetSimplex.3D.git
   cd NetSimplex.3D
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key to `.env.local`:
   ```
   VITE_GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### Starting the Application

1. Launch the development server: `npm run dev`
2. Navigate to `http://localhost:3000` in your web browser
3. You'll see the initial boot screen followed by the landing page

### Navigation

- **Landing Page**: Overview and project introduction
- **3D Simulation**: Main interactive network visualization
- **Simulation Controls**: Play, pause, and control simulation speed
- **Debugger**: Trace network operations and packet flow
- **Client Browser**: Simulate client-server interactions
- **Architecture Comparison**: View different networking paradigms side-by-side
- **Architectural Notes**: Detailed explanations and learning materials

### Keyboard and Mouse Controls

- **Mouse**: Rotate and zoom the 3D view
- **Click**: Select nodes for detailed inspection
- **Controls Panel**: Use GUI buttons for simulation control

## 📁 Project Structure

```
NetSimplex.3D/
├── src/
│   ├── components/           # React components
│   │   ├── ThreeTopologyScene.tsx    # 3D visualization
│   │   ├── SimulationControls.tsx    # Simulation control panel
│   │   ├── ExecutionDebugger.tsx     # Network debugging interface
│   │   ├── VirtualClientBrowser.tsx  # Client simulation
│   │   ├── ServerCentricComparison.tsx
│   │   ├── ArchitectureDeepDive.tsx
│   │   ├── ArchitecturalNotes.tsx
│   │   ├── HeaderNav.tsx
│   │   ├── LandingPage.tsx
│   │   └── ...
│   ├── context/
│   │   └── ThemeContext.tsx  # Theme management
│   ├── data/
│   │   ├── simulationData.ts # Simulation scenarios and data
│   │   └── informationCentricData.ts
│   ├── types.ts              # TypeScript type definitions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── assets/                   # Static assets
├── public/                   # Public files
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
└── index.html               # HTML template
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Remove build artifacts

## 🙏 Credits & Acknowledgments

### Powered by Google Gemini

This project leverages **Google's Gemini 3.7 Flash** model for AI-powered features and intelligent analysis of network behavior. We are grateful to Google for providing this cutting-edge AI technology.

- [Google AI Studio](https://aistudio.google.com)
- [Google GenAI Documentation](https://ai.google.dev/)

### Built With

- [React](https://react.dev)
- [Three.js](https://threejs.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Express.js](https://expressjs.com)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License allows for free use, modification, and distribution of this software for both commercial and educational purposes.

## 👨‍💼 Author

**Naren S J**

- **Email**: [naensonu1520@gmail.com](mailto:naensonu1520@gmail.com)
- **GitHub**: [@Naren1520](https://github.com/Naren1520)
- **LinkedIn**: [Naren SJ](https://www.linkedin.com/in/narensj20)

## 🤝 Contributing

Contributions are welcome! This is an educational project, and we encourage the community to contribute improvements, bug fixes, and educational enhancements.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Write clear, self-documenting code
- Add comments for complex logic
- Ensure type safety throughout
- Test your changes before submitting

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea for improvement? Please open an issue on GitHub:
- [GitHub Issues](https://github.com/Naren1520/NetSimplex.3D/issues)

## 📚 Additional Resources

- [Network Architecture Fundamentals](https://en.wikipedia.org/wiki/Network_architecture)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Documentation](https://react.dev)
- [Google Gemini API Guide](https://ai.google.dev/tutorials)

## ⚠️ Disclaimer

This project is provided "as-is" for educational purposes. While effort has been made to ensure accuracy in network simulations, real-world network behavior may differ. This tool is intended for learning and research and should not be used for production network analysis without proper validation.

## 🎯 Future Roadmap

- [ ] Mobile-responsive interface
- [ ] Advanced network metrics dashboard
- [ ] Custom scenario builder
- [ ] Network topology import/export
- [ ] Collaborative learning features
- [ ] Extended AI-powered analysis

---

**Last Updated**: August 2026  
**Version**: 0.0.0 (Educational Preview)

Made with ❤️ for the networking community
