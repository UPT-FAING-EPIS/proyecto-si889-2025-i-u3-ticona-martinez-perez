// src/utils/analytics.js
import ENV from '../config/environment.js';

// Configuración de Google Analytics
export const GA_TRACKING_ID = ENV.GA_TRACKING_ID;

// Función para inicializar GA
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Cargar el script de Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: 'UML Diagram Generator',
      page_location: window.location.href,
    });

    console.log('📊 Google Analytics inicializado con ID:', GA_TRACKING_ID);
  }
};

// Función para trackear eventos
export const trackEvent = (action, category = 'User Interaction', label = '', value = 0) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log('📈 Evento trackeado:', { action, category, label, value });
  }
};

// Función para trackear páginas
export const trackPageView = (page_path, page_title = '') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: page_path,
      page_title: page_title,
    });
    console.log('📄 Página trackeada:', { page_path, page_title });
  }
};

// Eventos específicos para tu aplicación UML Generator
export const trackDiagramGeneration = (diagramType, sourceType, success = true) => {
  trackEvent('generate_diagram', 'UML Generation', `${diagramType}_${sourceType}`, success ? 1 : 0);
};

export const trackRepositoryAnalysis = (sourceType, fileCount = 0) => {
  trackEvent('analyze_repository', 'Repository Analysis', sourceType, fileCount);
};

export const trackFileUpload = (fileType, fileSize = 0) => {
  trackEvent('upload_file', 'File Upload', fileType, Math.round(fileSize / 1024)); // KB
};

export const trackError = (errorType, errorMessage = '') => {
  trackEvent('error_occurred', 'Error', `${errorType}: ${errorMessage.substring(0, 100)}`);
};

export const trackGitHubClone = (repoUrl, success = true) => {
  trackEvent('clone_github_repo', 'GitHub Integration', repoUrl, success ? 1 : 0);
};

export const trackDiagramDownload = (diagramType, format = 'puml') => {
  trackEvent('download_diagram', 'File Download', `${diagramType}_${format}`);
};

export const trackZipUpload = (fileName, fileSize = 0) => {
  trackEvent('zip_upload', 'File Upload', fileName, Math.round(fileSize / 1024));
};

export const trackUserInteraction = (action, element = '') => {
  trackEvent('user_interaction', 'UI Interaction', `${action}_${element}`);
};
