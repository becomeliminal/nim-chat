import React from 'react';
import { NimChat } from '../src';

function App() {
  // Get URLs from environment or default to localhost
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.liminal.cash';

  return (
    <div className="demo-content">
      <h1>Nim Chat Demo</h1>
      <p>
        This is an example page demonstrating the Nim Chat widget. The chat bubble
        in the bottom-right corner connects to a nim-go-sdk backend server.
      </p>
      <p>
        Try sending a message, and if your backend supports tool use, trigger an
        action that requires confirmation to see the approval card with countdown.
      </p>
      <div className="hint">
        Click the chat bubble in the bottom-right corner to start chatting!
      </div>

      <NimChat
        wsUrl={wsUrl}
        apiUrl={apiUrl}
        title="Nim"
        position="bottom-right"
      />
    </div>
  );
}

export default App;
