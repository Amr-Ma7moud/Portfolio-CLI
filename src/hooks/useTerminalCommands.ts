import { useCallback } from 'react';
import { useTerminal, ThemeColor } from '@/context/TerminalContext';

const SECTIONS = ['home', 'about', 'experience', 'projects', 'skills', 'achievements', 'contact'];

// Levenshtein distance for fuzzy matching
const levenshtein = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
};

const KNOWN_COMMANDS = [
  'help', 'clear', 'cat', 'ls', 'history', 'cd', 'wget', 'mail', 'sudo',
  'matrix', 'neofetch', 'tree', 'man', 'fortune', 'theme', 'mute', 'unmute',
  'alias', 'unalias', 'fullscreen', 'fs', 'exit', 'hack', 'rm'
];

const FORTUNES = [
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
  '"First, solve the problem. Then, write the code." - John Johnson',
  '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
  '"Simplicity is the soul of efficiency." - Austin Freeman',
  '"Make it work, make it right, make it fast." - Kent Beck',
  '"The best error message is the one that never shows up." - Thomas Fuchs',
  '"Programming isn\'t about what you know; it\'s about what you can figure out." - Chris Pine',
  '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
  '"Debugging is twice as hard as writing the code in the first place." - Brian Kernighan',
  '"Talk is cheap. Show me the code." - Linus Torvalds',
];

const NEOFETCH = `
                   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣤⣤⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                   ⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠀⠀⠀⠀⠀⠀
                   ⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀    guest@amr-mahmoud
                   ⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀    ─────────────────
                   ⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀    OS: AMR-OS v1.0.0
                   ⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀    Host: Portfolio Terminal
                   ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀    Kernel: React 18.x
                   ⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀    Uptime: Since 2003
                   ⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀    Languages: 7+
                   ⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀    Frameworks: 6+
                   ⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀    Shell: zsh
                   ⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀    Theme: Matrix Green
                   ⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀    Coffee: ☕ Unlimited
                   ⠀⠀⠀⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠀⠀
                   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

const TREE = `
~/portfolio/
├── ./identity.txt
├── ./about.md
├── ./skills.json
├── ./achievements.log
├── projects/
│   ├── project-u/
│   ├── task-manager/
│   ├── course-catalog/
│   └── diff-eq-solver/
├── experience/
│   ├── e-just-intern/
│   └── depi-trainee/
└── contact/
    ├── email
    ├── github
    ├── linkedin
    └── whatsapp
`;

const HELP_TEXT = `
╔═══════════════════════════════════════════════════════════════╗
║                      AVAILABLE COMMANDS                        ║
╠═══════════════════════════════════════════════════════════════╣
║ NAVIGATION                                                      ║
║   cat ./identity.txt    │ Show my identity                     ║
║   cat ./about.md        │ Read about me                        ║
║   cat ./skills.json     │ Display skills                       ║
║   cat ./achievements.log│ View achievements                    ║
║   ls -la ./projects/    │ List all projects                    ║
║   history --work        │ Show work experience                 ║
║   ./send_message.sh     │ Open contact options                 ║
║   tree                  │ Show portfolio structure             ║
╠═══════════════════════════════════════════════════════════════╣
║ SYSTEM                                                          ║
║   neofetch              │ Display system info                  ║
║   fortune               │ Random programming quote             ║
║   theme <color>         │ Change theme (green/amber/cyan/white)║
║   fullscreen / fs       │ Enter fullscreen terminal            ║
║   clear                 │ Clear terminal                       ║
║   mute / unmute         │ Toggle typing sounds                 ║
╠═══════════════════════════════════════════════════════════════╣
║ ALIASES                                                         ║
║   alias                 │ List all aliases                     ║
║   alias name=command    │ Create alias                         ║
║   unalias name          │ Remove alias                         ║
╠═══════════════════════════════════════════════════════════════╣
║ EASTER EGGS                                                     ║
║   matrix                │ ???                                  ║
║   hack <target>         │ ???                                  ║
╠═══════════════════════════════════════════════════════════════╣
║ VIM KEYBINDINGS                                                 ║
║   j/k                   │ Scroll down/up                       ║
║   G / gg                │ Go to bottom/top                     ║
║   /                     │ Focus terminal input                 ║
║   Escape                │ Exit fullscreen/unfocus              ║
╚═══════════════════════════════════════════════════════════════╝
`;

const MAN_PAGES: Record<string, string> = {
  cat: `
NAME
    cat - concatenate and print files

SYNOPSIS
    cat [file]

DESCRIPTION
    Display the contents of a file.
    
EXAMPLES
    cat ./about.md       Read about me
    cat ./skills.json    View skills
`,
  theme: `
NAME
    theme - change terminal color theme

SYNOPSIS
    theme <color>

DESCRIPTION
    Changes the terminal color scheme.
    Available themes: green, amber, cyan, white
    
EXAMPLES
    theme amber     Switch to amber/orange theme
    theme cyan      Switch to cyan/blue theme
`,
  alias: `
NAME
    alias - create command shortcuts

SYNOPSIS
    alias [name=command]

DESCRIPTION
    Create or list command aliases.
    Aliases are saved to localStorage.

EXAMPLES
    alias               List all aliases
    alias h=help        Create alias 'h' for 'help'
    alias p='ls -la ./projects/'
`,
};

const IDENTITY_TEXT = `
╔═══════════════════════════════════════════════════════════════╗
║                      ./identity.txt                            ║
╠═══════════════════════════════════════════════════════════════╣
║   Name:     Amr Mahmoud                                        ║
║   Role:     Full Stack Web Developer | Android Developer       ║
║   Location: New Borg Al-Arab City, Alexandria, Egypt           ║
║   "What I can't make, I don't understand."                     ║
╚═══════════════════════════════════════════════════════════════╝
`;

const ABOUT_TEXT = `
# ./about.md

## 👨‍💻 About Me

Computer Science student at **E-JUST** (Class of 2027)
**GPA:** 3.58

### Currently
- 📱 DEPI Trainee (Android Development)
- 💻 E-JUST IT Intern (Laravel/Backend)  
- 🏆 ISF Scholar

### Interests
Building full-stack web applications and Android apps.
Passionate about clean code and learning new technologies.
`;

const SKILLS_JSON = `{
  "user": "amr-mahmoud",
  "role": "Full Stack Developer",
  "languages": ["Python", "Java", "C++", "PHP", "JavaScript", "TypeScript", "Kotlin"],
  "frameworks": {
    "backend": ["Flask", "Laravel", "Express"],
    "frontend": ["React", "Next.js", "Tailwind CSS"],
    "mobile": ["Android (Kotlin/Java)"]
  },
  "tools": ["Git", "Docker", "Linux", "MATLAB", "Firebase"],
  "databases": ["MySQL", "PostgreSQL", "MongoDB"]
}`;

const PROJECTS_LIST = `
total 4
drwxr-xr-x  2 amr amr 4096 Dec 28 ./
drwxr-xr-x 10 amr amr 4096 Dec 28 ../
drwxr-xr-x  1 amr amr 4096 Dec 28 project-u/
drwxr-xr-x  1 amr amr 4096 Dec 28 task-manager/
drwxr-xr-x  1 amr amr 4096 Dec 28 course-catalog/
drwxr-xr-x  1 amr amr 4096 Dec 28 diff-eq-solver/

📁 project-u/          Python/Flask University Recommender
📁 task-manager/       Electron/Python System Monitor  
📁 course-catalog/     PHP/Laravel Search Engine
📁 diff-eq-solver/     MATLAB Differential Equations Solver
`;

const ACHIEVEMENTS_LOG = `
[2024-12-28] INFO: Loading achievements...

✅ ISF Scholarship Recipient
   └─ Awarded full scholarship for academic excellence

✅ DEPI Android Development Program
   └─ Selected for intensive Android training

✅ E-JUST IT Department Intern
   └─ Backend development with Laravel

✅ Dean's List - Multiple Semesters
   └─ Maintained GPA above 3.5

[EOF] achievements.log
`;

const WORK_HISTORY = `
📋 Work Experience History
══════════════════════════════════════════════════════════════

[2024 - Present] IT Intern
├── Company: E-JUST (Egypt-Japan University)
├── Role: Backend Developer
├── Stack: Laravel, PHP, MySQL
└── Tasks: Building internal university systems

[2024 - Present] DEPI Trainee  
├── Program: Digital Egypt Pioneers Initiative
├── Track: Android Development
├── Stack: Kotlin, Java, Android SDK
└── Focus: Building native Android applications

══════════════════════════════════════════════════════════════
`;

const SEND_MESSAGE = `
📬 Contact Options
══════════════════════════════════════════════════════════════

  [1] 📧 Email:    amr.mahmoud.dev05@gmail.com
  [2] 💼 LinkedIn: linkedin.com/in/amr-mahmoud-dev
  [3] 🐙 GitHub:   github.com/Amr-Ma7moud
  [4] 💬 WhatsApp: wa.me/201234567890

Type 'mail' to open email client directly.
══════════════════════════════════════════════════════════════
`;

export const useTerminalCommands = () => {
  const {
    addToHistory,
    addOutput,
    clearOutput,
    history,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    setIsFullscreen,
    aliases,
    setAlias,
    removeAlias,
    getAlias,
    triggerMatrix,
  } = useTerminal();

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
    return false;
  }, []);

  const findSimilarCommand = useCallback((input: string): string | null => {
    const cmd = input.split(' ')[0].toLowerCase();
    let bestMatch = '';
    let bestDistance = Infinity;

    for (const known of KNOWN_COMMANDS) {
      const dist = levenshtein(cmd, known);
      if (dist < bestDistance && dist <= 2) {
        bestDistance = dist;
        bestMatch = known;
      }
    }

    return bestDistance <= 2 ? bestMatch : null;
  }, []);

  const fakeProgress = useCallback((message: string, callback: () => void) => {
    const frames = ['▓░░░░░░░░░', '▓▓░░░░░░░░', '▓▓▓░░░░░░░', '▓▓▓▓░░░░░░', '▓▓▓▓▓░░░░░', 
                    '▓▓▓▓▓▓░░░░', '▓▓▓▓▓▓▓░░░', '▓▓▓▓▓▓▓▓░░', '▓▓▓▓▓▓▓▓▓░', '▓▓▓▓▓▓▓▓▓▓'];
    let i = 0;
    addOutput({ type: 'output', content: `${message} ${frames[0]}` });
    
    const interval = setInterval(() => {
      i++;
      if (i < frames.length) {
        // Update last line (simple approach - just add new line)
      } else {
        clearInterval(interval);
        callback();
      }
    }, 100);
  }, [addOutput]);

  const getAutocomplete = useCallback((partial: string): string[] => {
    const matches: string[] = [];
    const lowerPartial = partial.toLowerCase();
    
    const fullCommands = [
      'help', 'clear', 'neofetch', 'matrix', 'tree', 'fortune',
      'fullscreen', 'fs', 'mute', 'unmute', 'alias', 'exit',
      'cat ./identity.txt', 'cat ./about.md', 'cat ./skills.json',
      'cat ./achievements.log', 'ls -la ./projects/', 'history --work',
      './send_message.sh', 'wget cv', 'theme green', 'theme amber',
      'theme cyan', 'theme white', 'man cat', 'man theme', 'man alias',
    ];
    
    // Add aliases
    Object.keys(aliases).forEach(alias => {
      fullCommands.push(alias);
    });
    
    fullCommands.forEach(cmd => {
      if (cmd.toLowerCase().startsWith(lowerPartial)) {
        matches.push(cmd);
      }
    });
    
    return matches;
  }, [aliases]);

  const executeCommand = useCallback((input: string) => {
    let trimmedInput = input.trim();
    const lowerInput = trimmedInput.toLowerCase();
    
    // Check for alias
    const firstWord = trimmedInput.split(' ')[0];
    const aliasedCommand = getAlias(firstWord);
    if (aliasedCommand) {
      trimmedInput = aliasedCommand + trimmedInput.slice(firstWord.length);
    }
    
    const lowerResolved = trimmedInput.toLowerCase();
    
    addToHistory(input);
    addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${input}` });

    // === HELP ===
    if (lowerResolved === 'help') {
      addOutput({ type: 'ascii', content: HELP_TEXT });
    }
    
    // === NAVIGATION COMMANDS ===
    else if (lowerResolved === 'cat ./identity.txt' || lowerResolved === 'cat identity.txt') {
      addOutput({ type: 'ascii', content: IDENTITY_TEXT });
      scrollToSection('home');
    }
    else if (lowerResolved === 'cat ./about.md' || lowerResolved === 'cat about.md' || lowerResolved === 'cat about') {
      addOutput({ type: 'output', content: ABOUT_TEXT });
      scrollToSection('about');
    }
    else if (lowerResolved === 'cat ./skills.json' || lowerResolved === 'cat skills.json' || lowerResolved === 'whoami') {
      addOutput({ type: 'output', content: SKILLS_JSON });
      scrollToSection('skills');
    }
    else if (lowerResolved === 'cat ./achievements.log' || lowerResolved === 'cat achievements.log') {
      addOutput({ type: 'output', content: ACHIEVEMENTS_LOG });
      scrollToSection('achievements');
    }
    else if (lowerResolved.match(/^ls\s+(-la\s+)?\.?\/?(projects)\/?$/)) {
      addOutput({ type: 'output', content: PROJECTS_LIST });
      scrollToSection('projects');
    }
    else if (lowerResolved === 'history --work' || lowerResolved === 'history -w') {
      addOutput({ type: 'output', content: WORK_HISTORY });
      scrollToSection('experience');
    }
    else if (lowerResolved === './send_message.sh' || lowerResolved === 'send_message.sh') {
      addOutput({ type: 'ascii', content: SEND_MESSAGE });
      scrollToSection('contact');
    }
    else if (lowerResolved === 'tree') {
      addOutput({ type: 'ascii', content: TREE });
    }
    
    // === SYSTEM COMMANDS ===
    else if (lowerResolved === 'neofetch') {
      addOutput({ type: 'ascii', content: NEOFETCH });
    }
    else if (lowerResolved === 'fortune') {
      const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      addOutput({ type: 'output', content: `\n🔮 ${quote}\n` });
    }
    else if (lowerResolved.startsWith('theme ')) {
      const newTheme = lowerResolved.slice(6).trim() as ThemeColor;
      if (['green', 'amber', 'cyan', 'white'].includes(newTheme)) {
        setTheme(newTheme);
        addOutput({ type: 'success', content: `Theme changed to ${newTheme}` });
      } else {
        addOutput({ type: 'error', content: `Invalid theme. Available: green, amber, cyan, white` });
      }
    }
    else if (lowerResolved === 'theme') {
      addOutput({ type: 'output', content: `Current theme: ${theme}\nAvailable: green, amber, cyan, white` });
    }
    else if (lowerResolved === 'mute') {
      setSoundEnabled(false);
      addOutput({ type: 'success', content: '🔇 Sounds muted' });
    }
    else if (lowerResolved === 'unmute') {
      setSoundEnabled(true);
      addOutput({ type: 'success', content: '🔊 Sounds enabled' });
    }
    else if (lowerResolved === 'fullscreen' || lowerResolved === 'fs') {
      setIsFullscreen(true);
      addOutput({ type: 'success', content: 'Entering fullscreen mode... (Press Escape to exit)' });
    }
    else if (lowerResolved === 'clear') {
      clearOutput();
    }
    
    // === ALIAS COMMANDS ===
    else if (lowerResolved === 'alias') {
      const aliasList = Object.entries(aliases);
      if (aliasList.length === 0) {
        addOutput({ type: 'output', content: 'No aliases defined. Use: alias name=command' });
      } else {
        const text = aliasList.map(([name, cmd]) => `  ${name}='${cmd}'`).join('\n');
        addOutput({ type: 'output', content: `Defined aliases:\n${text}` });
      }
    }
    else if (lowerResolved.startsWith('alias ')) {
      const rest = trimmedInput.slice(6);
      const eqIndex = rest.indexOf('=');
      if (eqIndex > 0) {
        const name = rest.slice(0, eqIndex).trim();
        let cmd = rest.slice(eqIndex + 1).trim();
        // Remove surrounding quotes if present
        if ((cmd.startsWith("'") && cmd.endsWith("'")) || (cmd.startsWith('"') && cmd.endsWith('"'))) {
          cmd = cmd.slice(1, -1);
        }
        setAlias(name, cmd);
        addOutput({ type: 'success', content: `Alias created: ${name}='${cmd}'` });
      } else {
        addOutput({ type: 'error', content: 'Usage: alias name=command' });
      }
    }
    else if (lowerResolved.startsWith('unalias ')) {
      const name = lowerResolved.slice(8).trim();
      removeAlias(name);
      addOutput({ type: 'success', content: `Alias '${name}' removed` });
    }
    
    // === MAN PAGES ===
    else if (lowerResolved.startsWith('man ')) {
      const topic = lowerResolved.slice(4).trim();
      if (MAN_PAGES[topic]) {
        addOutput({ type: 'output', content: MAN_PAGES[topic] });
      } else {
        addOutput({ type: 'error', content: `No manual entry for ${topic}` });
      }
    }
    
    // === EASTER EGGS ===
    else if (lowerResolved === 'matrix') {
      addOutput({ type: 'success', content: 'Entering the Matrix...' });
      triggerMatrix();
    }
    else if (lowerResolved.startsWith('hack ')) {
      const target = trimmedInput.slice(5).trim();
      addOutput({ type: 'output', content: `
[*] Initializing hack sequence...
[*] Target: ${target}
[*] Scanning ports... 22, 80, 443, 8080
[*] Exploiting vulnerabilities...
[████████████████████] 100%
[!] ACCESS DENIED
[!] Nice try, but I'm a portfolio, not a hacking tool 😎
` });
    }
    else if (lowerResolved.startsWith('rm -rf') || lowerResolved === 'rm -rf /' || lowerResolved.startsWith('sudo rm -rf')) {
      addOutput({ type: 'error', content: `
🚨 DANGER ZONE 🚨
rm: cannot remove '/': Permission denied
(Nice try though 😈)
` });
    }
    else if (lowerResolved === 'sudo login') {
      // This will be handled by the component that uses this hook
      addOutput({ type: 'output', content: 'Starting login... Enter email:' });
      // Signal that we need login input
      return { needsLogin: true };
    }
    else if (lowerResolved === 'sudo logout') {
      addOutput({ type: 'output', content: 'Logging out...' });
      return { needsLogout: true };
    }
    else if (lowerResolved === 'sudo status') {
      return { needsStatus: true };
    }
    else if (lowerResolved === 'sudo init') {
      return { needsInit: true };
    }
    else if (lowerResolved.startsWith('sudo edit ')) {
      // Parse: sudo edit path value
      const rest = trimmedInput.slice(10).trim();
      const spaceIndex = rest.indexOf(' ');
      if (spaceIndex === -1) {
        addOutput({ type: 'error', content: 'Usage: sudo edit <path> <value>\nExample: sudo edit profile.name "New Name"' });
      } else {
        const path = rest.slice(0, spaceIndex);
        let value = rest.slice(spaceIndex + 1).trim();
        // Try to parse as JSON if it looks like JSON
        try {
          if (value.startsWith('{') || value.startsWith('[') || value === 'true' || value === 'false' || !isNaN(Number(value))) {
            value = JSON.parse(value);
          } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
        } catch { /* keep as string */ }
        return { needsEdit: true, editPath: path, editValue: value };
      }
    }
    else if (lowerResolved.startsWith('sudo add ')) {
      // Parse: sudo add path {json}
      const rest = trimmedInput.slice(9).trim();
      const spaceIndex = rest.indexOf(' ');
      if (spaceIndex === -1) {
        addOutput({ type: 'error', content: 'Usage: sudo add <path> <json>\nExample: sudo add projects {"name":"New"}' });
      } else {
        const path = rest.slice(0, spaceIndex);
        const jsonStr = rest.slice(spaceIndex + 1).trim();
        try {
          const item = JSON.parse(jsonStr);
          return { needsAdd: true, addPath: path, addItem: item };
        } catch {
          addOutput({ type: 'error', content: 'Invalid JSON. Use: sudo add <path> {"key":"value"}' });
        }
      }
    }
    else if (lowerResolved.startsWith('sudo remove ')) {
      // Parse: sudo remove path index
      const rest = trimmedInput.slice(12).trim();
      const parts = rest.split(' ');
      if (parts.length !== 2 || isNaN(parseInt(parts[1]))) {
        addOutput({ type: 'error', content: 'Usage: sudo remove <path> <index>\nExample: sudo remove projects 0' });
      } else {
        return { needsRemove: true, removePath: parts[0], removeIndex: parseInt(parts[1]) };
      }
    }
    else if (lowerResolved.startsWith('sudo')) {
      addOutput({ type: 'output', content: `
Available sudo commands:
  sudo login              - Authenticate as admin
  sudo logout             - Sign out
  sudo status             - Show auth status
  sudo init               - Initialize Firebase with defaults
  sudo edit <path> <val>  - Edit a field
  sudo add <path> <json>  - Add to an array
  sudo remove <path> <i>  - Remove from array by index

Examples:
  sudo edit profile.name "John Doe"
  sudo edit profile.roles '["Dev","Designer"]'
  sudo add projects '{"name":"New Project"}'
  sudo remove experiences 0
      ` });
    }
    else if (lowerResolved === 'exit') {
      addOutput({ type: 'output', content: `
🎵 You can check out any time you like,
   But you can never leave... 🎵

(Use Escape to exit fullscreen mode)
` });
    }
    
    // === OTHER COMMANDS ===
    else if (lowerResolved.startsWith('cd ')) {
      const section = lowerResolved.slice(3).trim();
      if (SECTIONS.includes(section)) {
        scrollToSection(section);
        addOutput({ type: 'success', content: `Navigating to ${section}...` });
      } else {
        addOutput({ type: 'error', content: `cd: ${section}: No such directory` });
      }
    }
    else if (lowerResolved === 'wget cv' || lowerResolved === 'wget resume') {
      addOutput({ type: 'success', content: 'Downloading resume...' });
      addOutput({ type: 'output', content: '(Resume download would trigger here)' });
    }
    else if (lowerResolved === 'history') {
      if (history.length === 0) {
        addOutput({ type: 'output', content: 'No commands in history.' });
      } else {
        const historyText = history.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n');
        addOutput({ type: 'output', content: historyText });
      }
    }
    else if (lowerResolved === 'mail' || lowerResolved.startsWith('mail ')) {
      window.location.href = 'mailto:amr.mahmoud.dev05@gmail.com';
      addOutput({ type: 'success', content: 'Opening mail client...' });
    }
    else if (lowerResolved === 'ls' || lowerResolved === 'ls -la') {
      addOutput({ type: 'output', content: `Available sections: ${SECTIONS.join('  ')}` });
    }
    else if (lowerResolved === '') {
      // Empty command - do nothing
    }
    else if (lowerResolved.startsWith('cat ')) {
      const file = lowerResolved.slice(4).trim();
      addOutput({ type: 'error', content: `cat: ${file}: No such file or directory`, isGlitch: true });
    }
    else {
      // Unknown command - try fuzzy match
      const suggestion = findSimilarCommand(lowerResolved);
      let errorMsg = `${trimmedInput.split(' ')[0]}: command not found`;
      if (suggestion) {
        errorMsg += `\n\nDid you mean '${suggestion}'?`;
      }
      errorMsg += `\nType 'help' for available commands.`;
      addOutput({ type: 'error', content: errorMsg, isGlitch: true });
    }
  }, [
    addToHistory, addOutput, clearOutput, scrollToSection, history,
    theme, setTheme, setSoundEnabled, setIsFullscreen,
    aliases, setAlias, removeAlias, getAlias, triggerMatrix, findSimilarCommand
  ]);

  return {
    executeCommand,
    getAutocomplete,
    sections: SECTIONS,
  };
};
