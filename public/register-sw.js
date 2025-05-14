// Script para registrar o Service Worker

// Registra o Service Worker quando a página carregar
window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch(function(error) {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  }
});