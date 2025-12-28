# 🖥️ Amr Mahmoud | Developer Portfolio

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.7-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

A retro-terminal themed developer portfolio with an interactive CLI interface, Matrix effects, and Firebase-powered content management.

[🌐 Live Demo](https://amr-mahmoud.dev) • [📖 Terminal Guide](./TERMINAL_GUIDE.md) • [🔥 Firebase Setup](./FIREBASE_SETUP.md)

</div>

---

## ✨ Features

### 🎮 Interactive Terminal Experience
- **Fully functional CLI** - Navigate the portfolio using terminal commands
- **Vim keybindings** - Use `j`/`k` to scroll, `G`/`gg` for navigation
- **Command history** - Arrow keys to navigate previous commands
- **Custom aliases** - Create shortcuts with `alias name=command`
- **Fullscreen mode** - Immersive terminal experience with `fullscreen` or `fs`

### 🎨 Retro Aesthetics
- **CRT effects** - Authentic scanlines and screen flicker
- **Boot sequence** - Classic system startup animation
- **Matrix rain** - The iconic falling code effect
- **Multiple themes** - Green, amber, cyan, and white terminal colors
- **Typing sounds** - Optional keyboard audio feedback

### 🔧 Content Management
- **Firebase integration** - Real-time database for dynamic content
- **Admin commands** - Manage portfolio data via terminal with `sudo` commands
- **Live updates** - Changes reflect immediately across all sessions

### 📱 Responsive Design
- **Mobile-friendly** - Touch-optimized terminal menu
- **Adaptive layout** - Seamless experience across all devices

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Amr-Ma7moud/amr-mahmoud.git
cd amr-mahmoud

# Install dependencies
npm install
# or
bun install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> [!TIP]
> See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase configuration instructions.

---

## 💻 Terminal Commands

### Navigation
| Command | Description |
|---------|-------------|
| `cat ./identity.txt` | Show hero section |
| `cat ./about.md` | Read about me |
| `cat ./skills.json` | Display skills |
| `ls -la ./projects/` | List all projects |
| `history --work` | Show work experience |
| `./send_message.sh` | Open contact options |
| `tree` | Show portfolio structure |

### System
| Command | Description |
|---------|-------------|
| `neofetch` | Display system info with ASCII art |
| `fortune` | Random programming quote |
| `theme <color>` | Change theme (green/amber/cyan/white) |
| `fullscreen` | Enter fullscreen terminal |
| `clear` | Clear terminal output |
| `mute` / `unmute` | Toggle typing sounds |

### Easter Eggs 🥚
- `matrix` - Enter the Matrix!
- `hack <target>` - "Hack" anything
- `rm -rf /` - Nice try 😈
- `exit` - Hotel California

> [!NOTE]
> See [TERMINAL_GUIDE.md](./TERMINAL_GUIDE.md) for the complete command reference including admin commands.

---

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/              # shadcn/ui components
│   ├── TerminalInput.tsx
│   ├── FullscreenTerminal.tsx
│   ├── MatrixRain.tsx
│   └── ...
├── context/             # React contexts
│   ├── TerminalContext.tsx
│   └── SudoContext.tsx
├── hooks/               # Custom React hooks
│   ├── useTerminalCommands.ts
│   ├── useVimNavigation.ts
│   └── ...
├── lib/                 # Utilities
│   └── firebase.ts
├── data/                # Default/fallback data
├── types/               # TypeScript interfaces
└── pages/               # Page components
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **State Management** | React Context + TanStack Query |
| **Backend** | Firebase Realtime Database |
| **Authentication** | Firebase Auth |
| **Routing** | React Router DOM |
| **Forms** | React Hook Form + Zod |

---

## 📜 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🔐 Admin Access

The portfolio includes an admin system accessible through terminal commands:

```bash
# Login with Firebase credentials
sudo login

# Edit content
sudo edit profile.name "Your Name"
sudo edit profile.tagline "Your Tagline"

# Add new items
sudo add projects '{"name":"New Project","description":"..."}'

# Initialize/reset data
sudo init
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Amr-Ma7moud/amr-mahmoud/issues).

---

<div align="center">

**Built with ❤️ and ☕ by [Amr Mahmoud](https://amr-mahmoud.dev)**

</div>
