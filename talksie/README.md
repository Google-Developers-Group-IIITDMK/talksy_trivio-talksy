# TalkSie Frontend - React Application

A futuristic video-call-like interface for chatting with your favorite characters, built with React and Tailwind CSS.

## 🚀 Features

- **Splash Screen**: Animated loading with neon effects and particles
- **User Registration**: Glassmorphism form with floating labels
- **Character Selection**: Interactive cards with dynamic backgrounds
- **Character Room**: Immersive 3D-style character interface with animations
- **Call Controls**: Holographic floating controls with settings panel
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Character Theming**: Dynamic color schemes for each character

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SplashScreen/
│   │   │   ├── SplashScreen.jsx
│   │   │   └── SplashScreen.css
│   │   ├── UserInfoForm/
│   │   │   ├── UserInfoForm.jsx
│   │   │   └── UserInfoForm.css
│   │   ├── CharacterSelection/
│   │   │   ├── CharacterSelection.jsx
│   │   │   └── CharacterSelection.css
│   │   ├── CharacterRoom/
│   │   │   ├── CharacterRoom.jsx
│   │   │   └── CharacterRoom.css
│   │   └── CallControls/
│   │       ├── CallControls.jsx
│   │       └── CallControls.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Character Themes

### Voldemort
- Primary: Dark slate (#0f172a)
- Accent: Green (#22c55e)
- Personality: Mysterious, powerful, commanding
- Effects: Dark wisps and shadows

### Iron Man
- Primary: Dark red (#7f1d1d)
- Accent: Gold (#fbbf24)
- Personality: Witty, intelligent, innovative
- Effects: Tech grid and holographic elements

### Doraemon
- Primary: Sky blue (#0ea5e9)
- Accent: Gold (#fbbf24)
- Personality: Friendly, helpful, adventurous
- Effects: Magic sparkles and floating elements

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Install Dependencies
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🎯 Usage Flow

1. **Splash Screen**: Displays TalkSie logo with loading animation
2. **User Info Form**: User enters name, bio, and password
3. **Character Selection**: Choose from available characters (Voldemort, Iron Man, Doraemon)
4. **Character Room**: Interactive conversation interface with the selected character

## 🎮 Interactive Features

### Character Room
- Animated facial expressions (neutral, speaking, thinking, smiling)
- Real-time subtitles with neon glow effects
- Dynamic background based on character theme
- Holographic avatar with energy rings
- Status indicators (speaking/listening)

### Call Controls
- Mute/Unmute microphone
- Settings panel with volume control and preferences
- Change character option
- End call functionality
- Quick actions (screenshot, fullscreen, record)

## 🎨 Customization

### Adding New Characters
1. Add character data in `CharacterSelection.jsx`:
```javascript
{
  id: 'new-character',
  name: 'Character Name',
  description: 'Character description',
  emoji: '🔮',
  theme: {
    primary: '#color1',
    secondary: '#color2',
    accent: '#color3',
    glow: '#color4'
  },
  personality: 'Character traits',
  tags: ['Tag1', 'Tag2', 'Tag3']
}
```

2. Add theme-specific effects in `CharacterRoom.jsx`
3. Update Tailwind config with new colors if needed

### Styling Modifications
Each component has its own CSS file for easy customization:
- Modify colors, animations, and layouts
- All styles use Tailwind CSS utilities
- Custom animations defined in CSS files
- Responsive breakpoints already configured

## 🌟 Key Components Overview

### SplashScreen
- Animated particles floating across screen
- Gradient text with glow effects
- Progress bar with shimmer animation
- Letter-by-letter title animation

### UserInfoForm
- Glassmorphism design with backdrop blur
- Floating label inputs with smooth transitions
- Form validation with error messages
- Animated hologram assistant

### CharacterSelection
- Grid layout with hover effects
- Dynamic background based on character theme
- Smooth transitions and scaling animations
- Character-specific color schemes

### CharacterRoom
- 3D-style character placeholder with animations
- Facial expression changes (eyes, mouth movement)
- Real-time subtitle display
- Theme-based ambient effects
- Energy rings and holographic overlays

### CallControls
- Floating holographic buttons
- Expandable settings panel
- Volume controls and preferences
- Connection status and call timer

## 📱 Responsive Design

- **Desktop**: Full layout with all features
- **Tablet**: Adapted layout with optimized spacing
- **Mobile**: Stacked layout, simplified controls
- **Small Mobile**: Compact UI with essential features only

## 🚀 Future Enhancements

- Integration with React Three Fiber for 3D models
- Real voice synthesis and recognition
- Character AI responses
- Video recording functionality
- Multiple language support
- Custom character creation

## 🎭 Animation Features

- CSS-based animations for smooth performance
- Particle systems for ambient effects
- Smooth state transitions between screens
- Character-specific ambient effects
- Interactive hover states throughout

## 📄 License

This project is created for educational and demonstration purposes.