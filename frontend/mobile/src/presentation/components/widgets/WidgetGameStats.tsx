import React from "react";
import { Platform } from "react-native";

// Importación condicional
const WebView = Platform.OS === 'web' ? null : require("react-native-webview").WebView;

export default function MatchWidget() {
  const widgetHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="wg-api-football-game"
            data-host="v3.football.api-sports.io"
            data-key="50a0c0944d32698112f06a42b3b3248e"
            data-id="1379579"
            data-theme=""
            data-refresh="15"
            data-show-errors="false"
            data-show-logos="true">
        </div>
        <script type="module" src="https://widgets.api-sports.io/2.0.3/widgets.js"></script>
      </body>
    </html>
  `;

  // Para web, renderizar directamente el HTML
  if (Platform.OS === 'web') {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '300px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
        dangerouslySetInnerHTML={{ __html: widgetHtml }}
      />
    );
  }

  // Para móvil, usar WebView
  if (!WebView) {
    return null; // o un componente de fallback
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: widgetHtml }}
      style={{ flex: 1, height: 300 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
