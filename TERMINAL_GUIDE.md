# Terminal Commands Guide

Your portfolio features an interactive CLI terminal. Here's how to use it!

## Navigation Commands

| Command | Description |
|---------|-------------|
| `cat ./identity.txt` | Show identity/hero section |
| `cat ./about.md` | Read about me |
| `cat ./skills.json` | Display skills as JSON |
| `cat ./achievements.log` | View achievements |
| `ls -la ./projects/` | List all projects |
| `history --work` | Show work experience |
| `./send_message.sh` | Open contact options |
| `cd <section>` | Navigate to section |
| `tree` | Show portfolio structure |

## System Commands

| Command | Description |
|---------|-------------|
| `neofetch` | Display system info (cool ASCII art!) |
| `fortune` | Random programming quote |
| `theme <color>` | Change theme (green/amber/cyan/white) |
| `fullscreen` or `fs` | Enter fullscreen terminal |
| `clear` | Clear terminal output |
| `mute` / `unmute` | Toggle typing sounds |
| `alias name=cmd` | Create command shortcut |
| `history` | Show command history |

## Vim Keybindings

| Key | Action |
|-----|--------|
| `j` | Scroll down |
| `k` | Scroll up |
| `G` | Go to bottom |
| `gg` | Go to top |
| `/` | Focus terminal input |
| `Escape` | Exit fullscreen / unfocus |
| `Ctrl+D` | Page down |
| `Ctrl+U` | Page up |

## Easter Eggs 🥚

Try these for fun:
- `matrix` - Enter the Matrix!
- `hack <target>` - "Hack" anything
- `rm -rf /` - Nice try 😈
- `exit` - Hotel California

---

# Admin Commands (sudo)

These commands require authentication.

## Authentication

```bash
# Login with your Firebase admin email
sudo login

# Check authentication status
sudo status

# Logout
sudo logout
```

## Editing Data

### Edit a field
```bash
sudo edit <path> <value>

# Examples:
sudo edit profile.name "John Doe"
sudo edit profile.tagline "Building cool stuff"
sudo edit profile.location "Cairo, Egypt"
```

### Edit arrays
```bash
# Edit array item by index
sudo edit profile.roles.0 "Senior Developer"
sudo edit projects.0.name "Updated Project Name"
```

### Edit nested objects
```bash
# Use JSON for complex values
sudo edit profile.socials.0.url "https://github.com/newuser"
```

## Adding Items

```bash
sudo add <array-path> <json>

# Examples:
sudo add projects '{"name":"New Project","description":"Amazing app"}'
sudo add achievements '{"title":"Award","description":"Won hackathon"}'
sudo add experiences '{"title":"CTO","company":"Startup Inc"}'
```

## Removing Items

```bash
sudo remove <array-path> <index>

# Examples:
sudo remove projects 0      # Remove first project
sudo remove experiences 1   # Remove second experience
```

## Initialize Data

Reset database to defaults:

```bash
sudo init
```

---

## Data Paths Reference

### Profile
- `profile.name` - Your name
- `profile.roles` - Array of role titles
- `profile.location` - Your location
- `profile.tagline` - Hero tagline
- `profile.email` - Contact email
- `profile.socials` - Array of social links

### Projects (array)
- `projects.0.name` - Project name
- `projects.0.description` - Short description
- `projects.0.technologies` - Tech stack array
- `projects.0.githubUrl` - GitHub link
- `projects.0.featured` - Is featured (true/false)

### Experiences (array)
- `experiences.0.title` - Job title
- `experiences.0.company` - Company name
- `experiences.0.startDate` - Start date
- `experiences.0.endDate` - End date (null = present)
- `experiences.0.description` - Role description
- `experiences.0.skills` - Skills array

### Skills (array of categories)
- `skills.0.category` - Category name
- `skills.0.items` - Array of skill names

### Achievements (array)
- `achievements.0.title` - Achievement title
- `achievements.0.description` - Description
- `achievements.0.date` - Date string
- `achievements.0.icon` - Emoji icon
