import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

const WidgetGameStats = ({ fixtureId }: { fixtureId: number | undefined }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
      // Verificar que el mensaje viene del iframe correcto
      console.log("Mensaje recibido del iframe:", fixtureId);

  }, []);

  const widgetHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          margin: 0; 
          padding: 10px; 
          font-family: Arial, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      <api-sports-widget data-type="game" data-game-id="${fixtureId}"></api-sports-widget>

      <div id="team-container"></div>

      <api-sports-widget
        data-type="config"
        data-key="50a0c0944d32698112f06a42b3b3248e"
        data-sport="football"
        data-lang="es"
        data-refresh="240"
        data-show-logos="true"
        data-target-team="#team-container"
        data-player-statistics="false"
      ></api-sports-widget>

      <script type="module" src="https://widgets.api-sports.io/3.1.0/widgets.js"></script>
      
      <script>
        // Función para enviar la altura al padre
        function sendHeightToParent() {
          const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );
          
          window.parent.postMessage({
            type: 'resize',
            height: height + 20 // agregar un poco de padding
          }, '*');
        }

        // Observer para detectar cambios en el DOM
        const observer = new MutationObserver(() => {
          setTimeout(sendHeightToParent, 100);
        });

        // Observar cambios en el body
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        });

        // Enviar altura inicial después de que se cargue todo
        window.addEventListener('load', () => {
          setTimeout(sendHeightToParent, 500);
        });

        // También enviar en intervalos para asegurar que se actualice
        setInterval(sendHeightToParent, 2000);

        // Enviar altura inmediatamente
        setTimeout(sendHeightToParent, 100);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <iframe
        ref={iframeRef}
        title="API Football Widget"
        srcDoc={widgetHtml}
        style={{ 
          flex: 1,
          width: '100%', 
          border: 'none',
        }}
        scrolling="yes"
        onLoad={() => {
          // Enviar mensaje inicial después de que se cargue el iframe
          setTimeout(() => {
            iframeRef.current?.contentWindow?.postMessage({
              type: 'checkHeight'
            }, '*');
          }, 1000);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default WidgetGameStats;
