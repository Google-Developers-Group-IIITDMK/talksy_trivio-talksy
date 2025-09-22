import React, { useState } from 'react';
import './CallControls.css';

const CallControls = ({ onEndCall, onChangeCharacter, character }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);

  const controls = [
    {
      id: 'mute',
      icon: isMuted ? '🔇' : '🎤',
      label: isMuted ? 'Unmute' : 'Mute',
      onClick: () => setIsMuted(!isMuted),
      className: isMuted ? 'muted' : ''
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      onClick: () => setIsSettingsOpen(!isSettingsOpen),
      className: isSettingsOpen ? 'active' : ''
    },
    {
      id: 'change-character',
      icon: '👥',
      label: 'Change Character',
      onClick: onChangeCharacter
    },
    {
      id: 'end-call',
      icon: '📞',
      label: 'End Call',
      onClick: onEndCall,
      className: 'danger'
    }
  ];

  return (
    <div 
      className="call-controls-container"
      style={{
        '--theme-accent': character.theme.accent,
        '--theme-glow': character.theme.glow
      }}
    >
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="settings-panel">
          <div className="settings-content">
            <h3 className="settings-title">Call Settings</h3>
            
            <div className="setting-group">
              <label className="setting-label">Volume</label>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="volume-slider"
                />
                <span className="volume-display">{volume}%</span>
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Character Voice</label>
              <select className="setting-select">
                <option>Default Voice</option>
                <option>Deep Voice</option>
                <option>Soft Voice</option>
              </select>
            </div>

            <div className="setting-group">
              <label className="setting-label">Background Effects</label>
              <div className="toggle-switch">
                <input type="checkbox" id="effects-toggle" defaultChecked />
                <label htmlFor="effects-toggle" className="toggle-label"></label>
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Auto-Subtitles</label>
              <div className="toggle-switch">
                <input type="checkbox" id="subtitles-toggle" defaultChecked />
                <label htmlFor="subtitles-toggle" className="toggle-label"></label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="call-controls">
        {controls.map((control) => (
          <button
            key={control.id}
            className={`control-button ${control.className || ''}`}
            onClick={control.onClick}
            title={control.label}
          >
            <div className="button-inner">
              <span className="control-icon">{control.icon}</span>
              <div className="button-glow"></div>
            </div>
            <span className="control-label">{control.label}</span>
          </button>
        ))}
      </div>

      {/* Connection Status */}
      <div className="connection-status">
        <div className="status-indicator">
          <div className="status-dot connected"></div>
          <span className="status-text">Connected</span>
        </div>
        <div className="call-timer">
          <span className="timer-text">05:42</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action" title="Take Screenshot">
          📸
        </button>
        <button className="quick-action" title="Full Screen">
          ⛶
        </button>
        <button className="quick-action" title="Record Call">
          🔴
        </button>
      </div>
    </div>
  );
};

export default CallControls;