export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ja' | 'zh' | 'pt';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Header & Brand
    navAudit: 'Audit',
    navDiff: 'Diff',
    navRagPro: 'RAG PRO (V2)',
    researchLed: 'Research-led contract clarity',
    freeNoLogin: '100% Free · No Login Required',
    
    // Hero
    heroBadge: 'AI plain-language analysis',
    heroTitle: 'TermSight.',
    heroTagline1: 'You clicked accept.',
    heroTagline2: 'We read it for you.',
    heroSubtitle: 'Paste the legal wall of text, upload a PDF/DOCX, or fetch any terms URL to reveal hidden predatory clauses.',
    
    // Presets
    sampleTitle: 'Try a sample contract:',
    sampleAiSaas: 'Sneaky AI SaaS (IP Grab & Auto-renewal)',
    sampleFreelance: 'Freelance Client Agreement',
    sampleEula: 'Fair Open Source / Clean EULA',
    
    // Input Tabs
    tabPaste: 'Paste Text',
    tabUpload: 'Drop PDF / DOCX',
    tabUrl: 'Fetch URL',
    pastePlaceholder: 'Paste the full Terms of Service, Privacy Policy, EULA, or agreement here...\n\nExample: "1. License Grant: User grants company a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify and commercialize all uploaded content..."',
    urlPlaceholder: 'https://example.com/terms-of-service',
    fetchBtn: 'Fetch Terms',
    fetchingBtn: 'Fetching Webpage...',
    uploadDragText: 'Drop your contract here, or browse',
    uploadSupported: 'Supports .PDF, .DOCX, .TXT, .MD, .HTML (max 60,000 characters)',
    uploadSuccess: 'File loaded successfully',
    
    // Privacy Shield & Counters
    privacyShield: 'Privacy Shield',
    privacyOn: 'ON (PII Masked)',
    privacyOff: 'OFF',
    privacyNote: 'Auto-redacts names, emails, phone numbers & SSNs locally before analysis.',
    privacyMaskedCount: 'sensitive items masked client-side',
    words: 'words',
    chars: 'chars',
    
    // Action Buttons
    analyzeBtn: 'Analyze Contract',
    analyzingBtn: 'Auditing Contract...',
    reAnalyzeBtn: 'Re-analyze',
    clearBtn: 'Clear',
    
    // Diff Mode
    diffTitle: 'Compare Contract Versions',
    diffSubtitle: 'Detect added predatory clauses, sneaky amendments, and health score shifts between two versions of an agreement.',
    diffDocA: 'Original Terms (Version 1)',
    diffDocB: 'Updated / Renewal Terms (Version 2)',
    diffPlaceholderA: 'Paste original agreement...',
    diffPlaceholderB: 'Paste renewal or updated agreement...',
    diffCompareBtn: 'Compare Both Versions',
    diffComparingBtn: 'Comparing Versions...',
    diffLoadSample: 'Load Sample Diff (Sneaky Terms Update)',
    
    // Results
    resultsComplete: 'Contract read complete',
    resultsClauses: 'clauses. No fog.',
    copySummary: 'Copy summary',
    copied: 'Copied',
    legalNotices: 'Legal Notices',
    printPdf: 'Print / Save PDF',
    shareReport: 'Share',
    
    // Filters & Search
    filterAll: 'All Clauses',
    filterRed: 'Red Flags',
    filterYellow: 'Caution',
    filterGreen: 'Standard',
    searchPlaceholder: 'Search clauses, terms, or keywords...',
    noMatches: 'No clauses match your current filter or search.',
    resetFilter: 'Reset Filters',
    
    // Clause Card
    clauseNumber: 'CLAUSE',
    whatToDo: 'What to do:',
    counterClause: 'Counter-Clause',
    
    // Verdict Card
    verdictSafe: 'SAFE TO SIGN',
    verdictNegotiate: 'NEGOTIATE FIRST',
    verdictDoNotSign: 'DO NOT SIGN AS-IS',
    verdictTitle: 'Executive Verdict',
    checklistTitle: 'Pre-Signing Action Checklist',
    checklistSubtitle: 'Review these critical requirements before accepting or signing:',
    
    // Deadlines & Notices
    deadlinesTitle: 'Key Deadlines & Action Timeline',
    deadlinesSubtitle: 'Extracted cancellation windows, arbitration opt-outs, and billing terms.',
    addToGoogleCal: 'Add to Google Calendar',
    downloadIcs: 'Download .ICS Calendar File',
    
    // Ask Contract Q&A
    askTitle: 'Ask This Contract',
    askSubtitle: 'Instant semantic answers with exact verbatim clause citations.',
    askPlaceholder: 'Ask anything (e.g. Can they train AI on my data? How do I cancel?)',
    askBtn: 'Ask',
    askSample1: 'Can they sell my personal data?',
    askSample2: 'Can I cancel and get a refund?',
    askSample3: 'Do I give up right to sue in court?',
    askSample4: 'Can they use my content for AI training?',
    
    // Modals
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    emailDraft: 'Ready-to-Send Negotiation Email',
    copyEmail: 'Copy Email Draft',
    redlinePreview: 'Balanced Counter-Proposal Redline',
  },
  
  es: {
    // Header & Brand
    navAudit: 'Auditar',
    navDiff: 'Comparar',
    navRagPro: 'RAG PRO (V2)',
    researchLed: 'Claridad contractual guiada por investigación',
    freeNoLogin: '100% Gratis · Sin Registro',
    
    // Hero
    heroBadge: 'Análisis de IA en lenguaje claro',
    heroTitle: 'TermSight.',
    heroTagline1: 'Hiciste clic en aceptar.',
    heroTagline2: 'Nosotros lo leemos por ti.',
    heroSubtitle: 'Pega el texto legal, sube un PDF/DOCX o extrae cualquier URL de términos para detectar cláusulas abusivas ocultas.',
    
    // Presets
    sampleTitle: 'Prueba un contrato de ejemplo:',
    sampleAiSaas: 'SaaS de IA con trampa (Apropiación de IP y autorrenovación)',
    sampleFreelance: 'Contrato de Cliente Freelance',
    sampleEula: 'EULA Limpio / Código Abierto Justo',
    
    // Input Tabs
    tabPaste: 'Pegar Texto',
    tabUpload: 'Subir PDF / DOCX',
    tabUrl: 'Extraer de URL',
    pastePlaceholder: 'Pega aquí los Términos de Servicio, Política de Privacidad o contrato completo...\n\nEjemplo: "1. Licencia: El usuario otorga a la empresa una licencia perpetua, irrevocable y mundial..."',
    urlPlaceholder: 'https://ejemplo.com/terminos-de-servicio',
    fetchBtn: 'Extraer Términos',
    fetchingBtn: 'Extrayendo página...',
    uploadDragText: 'Arrastra tu contrato aquí o explora archivos',
    uploadSupported: 'Admite .PDF, .DOCX, .TXT, .MD, .HTML (máximo 60.000 caracteres)',
    uploadSuccess: 'Archivo cargado con éxito',
    
    // Privacy Shield & Counters
    privacyShield: 'Escudo de Privacidad',
    privacyOn: 'ACTIVO (Datos ocultos)',
    privacyOff: 'INACTIVO',
    privacyNote: 'Oculta automáticamente nombres, correos, teléfonos y números de identificación en el navegador.',
    privacyMaskedCount: 'elementos sensibles protegidos localmente',
    words: 'palabras',
    chars: 'caracteres',
    
    // Action Buttons
    analyzeBtn: 'Analizar Contrato',
    analyzingBtn: 'Auditando Contrato...',
    reAnalyzeBtn: 'Re-analizar',
    clearBtn: 'Limpiar',
    
    // Diff Mode
    diffTitle: 'Comparar Versiones de Contrato',
    diffSubtitle: 'Detecta cláusulas abusivas añadidas, modificaciones sigilosas y cambios en la puntuación de salud legal.',
    diffDocA: 'Términos Originales (Versión 1)',
    diffDocB: 'Términos Actualizados / Renovación (Versión 2)',
    diffPlaceholderA: 'Pega el contrato original...',
    diffPlaceholderB: 'Pega el contrato renovado o actualizado...',
    diffCompareBtn: 'Comparar Ambas Versiones',
    diffComparingBtn: 'Comparando Versiones...',
    diffLoadSample: 'Cargar Ejemplo de Comparación',
    
    // Results
    resultsComplete: 'Lectura del contrato completada',
    resultsClauses: 'cláusulas. Sin rodeos.',
    copySummary: 'Copiar resumen',
    copied: 'Copiado',
    legalNotices: 'Cartas Legales',
    printPdf: 'Imprimir / Guardar PDF',
    shareReport: 'Compartir',
    
    // Filters & Search
    filterAll: 'Todas las cláusulas',
    filterRed: 'Alertas Rojas',
    filterYellow: 'Precaución',
    filterGreen: 'Estándar',
    searchPlaceholder: 'Buscar cláusulas, términos o palabras clave...',
    noMatches: 'Ninguna cláusula coincide con los filtros.',
    resetFilter: 'Restablecer Filtros',
    
    // Clause Card
    clauseNumber: 'CLÁUSULA',
    whatToDo: 'Qué hacer:',
    counterClause: 'Contrapropuesta',
    
    // Verdict Card
    verdictSafe: 'SEGURO PARA FIRMAR',
    verdictNegotiate: 'NEGOCIAR PRIMERO',
    verdictDoNotSign: 'NO FIRMAR TAL COMO ESTÁ',
    verdictTitle: 'Veredicto Ejecutivo',
    checklistTitle: 'Lista de Verificación Previa a la Firma',
    checklistSubtitle: 'Revisa estos puntos críticos antes de aceptar o firmar:',
    
    // Deadlines & Notices
    deadlinesTitle: 'Plazos Clave y Cronograma de Acción',
    deadlinesSubtitle: 'Plazos de cancelación extraídos, exclusión de arbitraje y condiciones de facturación.',
    addToGoogleCal: 'Añadir a Google Calendar',
    downloadIcs: 'Descargar archivo .ICS',
    
    // Ask Contract Q&A
    askTitle: 'Preguntar a este Contrato',
    askSubtitle: 'Respuestas semánticas instantáneas con citas textuales exactas del contrato.',
    askPlaceholder: 'Pregunta lo que quieras (ej. ¿Pueden entrenar IA con mis datos? ¿Cómo cancelo?)',
    askBtn: 'Preguntar',
    askSample1: '¿Pueden vender mis datos personales?',
    askSample2: '¿Puedo cancelar y obtener un reembolso?',
    askSample3: '¿Renuncio al derecho de demandar en tribunales?',
    askSample4: '¿Pueden usar mi contenido para entrenar IA?',
    
    // Modals
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    emailDraft: 'Borrador de Correo de Negociación Listo para Enviar',
    copyEmail: 'Copiar Borrador de Correo',
    redlinePreview: 'Contrapropuesta Equilibrada',
  },

  fr: {
    // Header & Brand
    navAudit: 'Auditer',
    navDiff: 'Comparer',
    navRagPro: 'RAG PRO (V2)',
    researchLed: 'Clarté contractuelle issue de la recherche',
    freeNoLogin: '100% Gratuit · Sans Inscription',
    
    // Hero
    heroBadge: 'Analyse IA en langage clair',
    heroTitle: 'TermSight.',
    heroTagline1: 'Vous avez cliqué sur accepter.',
    heroTagline2: 'Nous le lisons pour vous.',
    heroSubtitle: 'Collez le texte juridique, téléchargez un PDF/DOCX ou extrayez une URL pour révéler les clauses abusives cachées.',
    
    // Presets
    sampleTitle: 'Tester un exemple de contrat :',
    sampleAiSaas: 'SaaS IA sournois (Accaparement de PI & reconduction)',
    sampleFreelance: 'Contrat Client Freelance',
    sampleEula: 'EULA Équitable / Open Source Sain',
    
    // Input Tabs
    tabPaste: 'Coller le texte',
    tabUpload: 'Déposer PDF / DOCX',
    tabUrl: 'Extraire une URL',
    pastePlaceholder: 'Collez l’intégralité des conditions d’utilisation ou du contrat ici...\n\nExemple : "1. Licence : L’utilisateur accorde une licence perpétuelle, irrévocable et mondiale..."',
    urlPlaceholder: 'https://exemple.com/conditions-generales',
    fetchBtn: 'Extraire les conditions',
    fetchingBtn: 'Extraction en cours...',
    uploadDragText: 'Déposez votre contrat ici ou parcourez',
    uploadSupported: 'Prend en charge .PDF, .DOCX, .TXT, .MD, .HTML (max 60 000 caractères)',
    uploadSuccess: 'Fichier chargé avec succès',
    
    // Privacy Shield & Counters
    privacyShield: 'Bouclier de Confidentialité',
    privacyOn: 'ACTIVÉ (Données masquées)',
    privacyOff: 'DÉSACTIVÉ',
    privacyNote: 'Masque automatiquement les noms, e-mails, numéros et identifiants dans le navigateur.',
    privacyMaskedCount: 'éléments sensibles masqués localement',
    words: 'mots',
    chars: 'caractères',
    
    // Action Buttons
    analyzeBtn: 'Analyser le Contrat',
    analyzingBtn: 'Audit du contrat en cours...',
    reAnalyzeBtn: 'Ré-analyser',
    clearBtn: 'Effacer',
    
    // Diff Mode
    diffTitle: 'Comparer les versions de contrat',
    diffSubtitle: 'Détectez les clauses prédatrices ajoutées, les modifications sournoises et les variations de score de conformité.',
    diffDocA: 'Conditions initiales (Version 1)',
    diffDocB: 'Conditions mises à jour (Version 2)',
    diffPlaceholderA: 'Collez le contrat d’origine...',
    diffPlaceholderB: 'Collez le contrat renouvelé ou mis à jour...',
    diffCompareBtn: 'Comparer les deux versions',
    diffComparingBtn: 'Comparaison en cours...',
    diffLoadSample: 'Charger un exemple de comparaison',
    
    // Results
    resultsComplete: 'Lecture du contrat terminée',
    resultsClauses: 'clauses. Zéro flou.',
    copySummary: 'Copier le résumé',
    copied: 'Copié',
    legalNotices: 'Courriers Juridiques',
    printPdf: 'Imprimer / Sauvegarder PDF',
    shareReport: 'Partager',
    
    // Filters & Search
    filterAll: 'Toutes les clauses',
    filterRed: 'Drapeaux Rouges',
    filterYellow: 'Attention',
    filterGreen: 'Standard',
    searchPlaceholder: 'Rechercher des clauses, termes ou mots-clés...',
    noMatches: 'Aucune clause ne correspond à votre recherche.',
    resetFilter: 'Réinitialiser les filtres',
    
    // Clause Card
    clauseNumber: 'CLAUSE',
    whatToDo: 'Que faire :',
    counterClause: 'Contre-proposition',
    
    // Verdict Card
    verdictSafe: 'SÛR À SIGNER',
    verdictNegotiate: 'NÉGOCIER D’ABORD',
    verdictDoNotSign: 'NE PAS SIGNER EN L’ÉTAT',
    verdictTitle: 'Verdict Exécutif',
    checklistTitle: 'Liste de Contrôle Pré-Signature',
    checklistSubtitle: 'Vérifiez ces éléments critiques avant de signer ou d’accepter :',
    
    // Deadlines & Notices
    deadlinesTitle: 'Délais Clés et Calendrier d’Action',
    deadlinesSubtitle: 'Délais de rétractation, opt-out d’arbitrage et modalités de facturation extraits.',
    addToGoogleCal: 'Ajouter à Google Agenda',
    downloadIcs: 'Télécharger le fichier .ICS',
    
    // Ask Contract Q&A
    askTitle: 'Interroger ce Contrat',
    askSubtitle: 'Réponses sémantiques instantanées avec citations textuelles précises.',
    askPlaceholder: 'Posez une question (ex. Peuvent-ils entraîner l’IA sur mes données ? Comment résilier ?)',
    askBtn: 'Demander',
    askSample1: 'Peuvent-ils vendre mes données personnelles ?',
    askSample2: 'Puis-je annuler et obtenir un remboursement ?',
    askSample3: 'Est-ce que je renonce à agir en justice ?',
    askSample4: 'Peuvent-ils utiliser mon contenu pour l’IA ?',
    
    // Modals
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    emailDraft: 'E-mail de négociation prêt à envoyer',
    copyEmail: 'Copier le modèle d’e-mail',
    redlinePreview: 'Contre-proposition équilibrée',
  },

  de: {
    // Header & Brand
    navAudit: 'Prüfen',
    navDiff: 'Vergleichen',
    navRagPro: 'RAG PRO (V2)',
    researchLed: 'Forschungsbasierte Vertragsklarheit',
    freeNoLogin: '100% Kostenlos · Kein Login erforderlich',
    
    // Hero
    heroBadge: 'KI-Klartextanalyse',
    heroTitle: 'TermSight.',
    heroTagline1: 'Sie haben auf Akzeptieren geklickt.',
    heroTagline2: 'Wir lesen es für Sie.',
    heroSubtitle: 'Fügen Sie den Rechtstext ein, laden Sie ein PDF/DOCX hoch oder rufen Sie eine URL ab, um versteckte Knebelklauseln aufzudecken.',
    
    // Presets
    sampleTitle: 'Mustervertrag ausprobieren:',
    sampleAiSaas: 'Tückisches KI-SaaS (Urheberrechtsabtretung & Auto-Verlängerung)',
    sampleFreelance: 'Freelancer-Kundenvertrag',
    sampleEula: 'Faires Open Source / Saubere EULA',
    
    // Input Tabs
    tabPaste: 'Text einfügen',
    tabUpload: 'PDF / DOCX ablegen',
    tabUrl: 'URL abrufen',
    pastePlaceholder: 'Fügen Sie hier die vollständigen AGB, Datenschutzbestimmungen oder Verträge ein...\n\nBeispiel: "1. Lizenzgewährung: Der Nutzer gewährt dem Unternehmen eine unbefristete, unwiderrufliche Lizenz..."',
    urlPlaceholder: 'https://beispiel.de/agb',
    fetchBtn: 'Bedingungen abrufen',
    fetchingBtn: 'Webseite wird abgerufen...',
    uploadDragText: 'Vertrag hier ablegen oder durchsuchen',
    uploadSupported: 'Unterstützt .PDF, .DOCX, .TXT, .MD, .HTML (max. 60.000 Zeichen)',
    uploadSuccess: 'Datei erfolgreich geladen',
    
    // Privacy Shield & Counters
    privacyShield: 'Datenschutz-Schild',
    privacyOn: 'AN (Daten maskiert)',
    privacyOff: 'AUS',
    privacyNote: 'Schwärzt Namen, E-Mails, Telefonnummern und IDs automatisch im Browser.',
    privacyMaskedCount: 'sensible Elemente lokal geschützt',
    words: 'Wörter',
    chars: 'Zeichen',
    
    // Action Buttons
    analyzeBtn: 'Vertrag Analysieren',
    analyzingBtn: 'Vertrag wird geprüft...',
    reAnalyzeBtn: 'Erneut analysieren',
    clearBtn: 'Löschen',
    
    // Diff Mode
    diffTitle: 'Vertragsversionen vergleichen',
    diffSubtitle: 'Erkennen Sie neu hinzugefügte Knebelklauseln, unbemerkte Änderungen und Verschiebungen des Fairness-Scores.',
    diffDocA: 'Ursprüngliche Bedingungen (Version 1)',
    diffDocB: 'Aktualisierte Bedingungen (Version 2)',
    diffPlaceholderA: 'Ursprünglichen Vertrag einfügen...',
    diffPlaceholderB: 'Aktualisierten Vertrag einfügen...',
    diffCompareBtn: 'Beide Versionen Vergleichen',
    diffComparingBtn: 'Versionen werden verglichen...',
    diffLoadSample: 'Muster-Vergleich laden',
    
    // Results
    resultsComplete: 'Vertragsprüfung abgeschlossen',
    resultsClauses: 'Klauseln. Volle Klarheit.',
    copySummary: 'Zusammenfassung kopieren',
    copied: 'Kopiert',
    legalNotices: 'Rechtliche Musterschreiben',
    printPdf: 'PDF Drucken / Speichern',
    shareReport: 'Teilen',
    
    // Filters & Search
    filterAll: 'Alle Klauseln',
    filterRed: 'Rote Flaggen',
    filterYellow: 'Vorsicht',
    filterGreen: 'Standard',
    searchPlaceholder: 'Klauseln oder Begriffe suchen...',
    noMatches: 'Keine Klauseln für diesen Filter gefunden.',
    resetFilter: 'Filter zurücksetzen',
    
    // Clause Card
    clauseNumber: 'KLAUSEL',
    whatToDo: 'Handlungsempfehlung:',
    counterClause: 'Gegenvorschlag',
    
    // Verdict Card
    verdictSafe: 'SICHER ZU UNTERZEICHNEN',
    verdictNegotiate: 'ZUERST NACHVERHANDELN',
    verdictDoNotSign: 'IN DIESER FORM NICHT UNTERZEICHNEN',
    verdictTitle: 'Zusammenfassendes Urteil',
    checklistTitle: 'Prüfliste vor der Unterzeichnung',
    checklistSubtitle: 'Überprüfen Sie diese kritischen Punkte vor der Annahme:',
    
    // Deadlines & Notices
    deadlinesTitle: 'Wichtige Fristen & Zeitplan',
    deadlinesSubtitle: 'Extrahierte Kündigungsfristen, Schiedsgerichts-Opt-outs und Zahlungsbedingungen.',
    addToGoogleCal: 'Zu Google Kalender hinzufügen',
    downloadIcs: '.ICS-Kalenderdatei herunterladen',
    
    // Ask Contract Q&A
    askTitle: 'Diesen Vertrag befragen',
    askSubtitle: 'Sofortige semantische Antworten mit exakten Zitatnachweisen.',
    askPlaceholder: 'Stellen Sie eine Frage (z.B. Dürfen meine Daten für KI-Training genutzt werden?)',
    askBtn: 'Fragen',
    askSample1: 'Dürfen meine personenbezogenen Daten verkauft werden?',
    askSample2: 'Kann ich kündigen und eine Rückerstattung erhalten?',
    askSample3: 'Verzichte ich auf mein Klagerecht vor Gericht?',
    askSample4: 'Wird mein Inhalt für KI-Training verwendet?',
    
    // Modals
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    emailDraft: 'Versandfertige Verhandlungs-E-Mail',
    copyEmail: 'E-Mail-Entwurf kopieren',
    redlinePreview: 'Ausgewogener Gegenvorschlag',
  },

  hi: {
    // Header & Brand
    navAudit: 'ऑडिट',
    navDiff: 'तुलना (Diff)',
    navRagPro: 'RAG PRO (V2)',
    researchLed: 'अनुसंधान-आधारित अनुबंध स्पष्टता',
    freeNoLogin: '100% मुफ्त · लॉगिन आवश्यक नहीं',
    
    // Hero
    heroBadge: 'AI सरल भाषा विश्लेषण',
    heroTitle: 'TermSight.',
    heroTagline1: 'आपने स्वीकार पर क्लिक किया।',
    heroTagline2: 'हम इसे आपके लिए पढ़ते हैं।',
    heroSubtitle: 'छिपे हुए नुकसानदेह नियमों को उजागर करने के लिए कानूनी दस्तावेज पेस्ट करें, PDF/DOCX अपलोड करें या कोई URL फेच करें।',
    
    // Presets
    sampleTitle: 'नमूना अनुबंध आज़माएं:',
    sampleAiSaas: 'चालाक AI SaaS (डेटा कब्जा व स्वतः नवीनीकरण)',
    sampleFreelance: 'फ्रीलांस क्लाइंट अनुबंध',
    sampleEula: 'उचित ओपन सोर्स / स्वच्छ EULA',
    
    // Input Tabs
    tabPaste: 'टेक्स्ट पेस्ट करें',
    tabUpload: 'PDF / DOCX डालें',
    tabUrl: 'URL से लाएं',
    pastePlaceholder: 'नियम व शर्तें, गोपनीयता नीति या अनुबंध यहां पेस्ट करें...\n\nउदाहरण: "1. लाइसेंस: उपयोगकर्ता कंपनी को अपलोड की गई सामग्री का उपयोग करने का अनिश्चितकालीन अधिकार देता है..."',
    urlPlaceholder: 'https://example.com/terms',
    fetchBtn: 'नियम लाएं',
    fetchingBtn: 'वेबपेज लाया जा रहा है...',
    uploadDragText: 'अपना अनुबंध यहां छोड़ें या ब्राउज़ करें',
    uploadSupported: '.PDF, .DOCX, .TXT, .MD, .HTML समर्थित (अधिकतम 60,000 अक्षर)',
    uploadSuccess: 'फ़ाइल सफलतापूर्वक लोड हुई',
    
    // Privacy Shield & Counters
    privacyShield: 'गोपनीयता शील्ड',
    privacyOn: 'चालू (डेटा सुरक्षित)',
    privacyOff: 'बंद',
    privacyNote: 'ब्राउज़र में ही नाम, ईमेल, फोन नंबर और पहचान नंबर अपने आप छिपा देता है।',
    privacyMaskedCount: 'संवेदनशील विवरण स्थानीय रूप से सुरक्षित',
    words: 'शब्द',
    chars: 'अक्षर',
    
    // Action Buttons
    analyzeBtn: 'अनुबंध का विश्लेषण करें',
    analyzingBtn: 'अनुबंध की जांच हो रही है...',
    reAnalyzeBtn: 'पुनः विश्लेषण करें',
    clearBtn: 'साफ़ करें',
    
    // Diff Mode
    diffTitle: 'अनुबंध संस्करणों की तुलना करें',
    diffSubtitle: 'दो संस्करणों के बीच नए जोड़े गए जोखिम, छिपे हुए बदलाव और निष्पक्षता स्कोर में गिरावट का पता लगाएं।',
    diffDocA: 'मूल शर्तें (संस्करण 1)',
    diffDocB: 'अद्यतन / नवीनीकरण शर्तें (संस्करण 2)',
    diffPlaceholderA: 'मूल अनुबंध पेस्ट करें...',
    diffPlaceholderB: 'नया या नवीनीकृत अनुबंध पेस्ट करें...',
    diffCompareBtn: 'दोनों संस्करणों की तुलना करें',
    diffComparingBtn: 'तुलना की जा रही है...',
    diffLoadSample: 'नमूना तुलना लोड करें',
    
    // Results
    resultsComplete: 'अनुबंध अध्ययन पूरा हुआ',
    resultsClauses: 'नियम। पूरी स्पष्टता।',
    copySummary: 'सारांश कॉपी करें',
    copied: 'कॉपी किया गया',
    legalNotices: 'कानूनी नोटिस',
    printPdf: 'PDF प्रिंट / सेव करें',
    shareReport: 'साझा करें',
    
    // Filters & Search
    filterAll: 'सभी नियम',
    filterRed: 'लाल चेतावनी (उच्च जोखिम)',
    filterYellow: 'सावधानी',
    filterGreen: 'मानक',
    searchPlaceholder: 'नियम या शब्द खोजें...',
    noMatches: 'कोई नियम नहीं मिला।',
    resetFilter: 'फ़िल्टर रीसेट करें',
    
    // Clause Card
    clauseNumber: 'नियम',
    whatToDo: 'क्या करें:',
    counterClause: 'जवाबी प्रस्ताव',
    
    // Verdict Card
    verdictSafe: 'हस्ताक्षर के लिए सुरक्षित',
    verdictNegotiate: 'पहले बातचीत (सौदा) करें',
    verdictDoNotSign: 'वर्तमान रूप में हस्ताक्षर न करें',
    verdictTitle: 'अंतिम फैसला',
    checklistTitle: 'हस्ताक्षर से पूर्व चेकलिस्ट',
    checklistSubtitle: 'स्वीकार करने या हस्ताक्षर करने से पहले इन मुख्य बिंदुओं की जांच करें:',
    
    // Deadlines & Notices
    deadlinesTitle: 'महत्वपूर्ण समय सीमा व एक्शन टाइमलाइन',
    deadlinesSubtitle: 'रद्द करने की अंतिम तिथि, मध्यस्थता से बाहर निकलने और बिलिंग की शर्तें।',
    addToGoogleCal: 'गूगल कैलेंडर में जोड़ें',
    downloadIcs: '.ICS कैलेंडर फ़ाइल डाउनलोड करें',
    
    // Ask Contract Q&A
    askTitle: 'अनुबंध से प्रश्न पूछें',
    askSubtitle: 'सटीक कानूनी संदर्भों के साथ तत्काल अर्थपूर्ण उत्तर।',
    askPlaceholder: 'कुछ भी पूछें (उदा. क्या वे मेरे डेटा पर AI को प्रशिक्षित कर सकते हैं?)',
    askBtn: 'पूछें',
    askSample1: 'क्या वे मेरा व्यक्तिगत डेटा बेच सकते हैं?',
    askSample2: 'क्या मैं रद्द करके धनवापसी पा सकता हूँ?',
    askSample3: 'क्या मैं अदालत जाने का अधिकार खो रहा हूँ?',
    askSample4: 'क्या वे AI प्रशिक्षण के लिए मेरी सामग्री का उपयोग करेंगे?',
    
    // Modals
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    emailDraft: 'भेजने के लिए तैयार बातचीत ईमेल',
    copyEmail: 'ईमेल ड्राफ्ट कॉपी करें',
    redlinePreview: 'संतुलित जवाबी प्रस्ताव',
  },

  ja: {
    // Header & Brand
    navAudit: '監査',
    navDiff: '比較',
    navRagPro: 'RAG PRO (V2)',
    researchLed: '研究に基づく契約の透明性',
    freeNoLogin: '100% 無料 · ログイン不要',
    
    // Hero
    heroBadge: 'AI による平易な言葉での分析',
    heroTitle: 'TermSight.',
    heroTagline1: '同意をクリックしたあなたへ。',
    heroTagline2: '私たちが代わりに読み解きます。',
    heroSubtitle: '法律文書の貼り付け、PDF/DOCXのアップロード、またはURL取得で、隠れた不当条項を暴きます。',
    
    // Presets
    sampleTitle: 'サンプルの契約を試す:',
    sampleAiSaas: '危険なAI SaaS (著作権奪取 & 自動更新)',
    sampleFreelance: 'フリーランス業務委託契約',
    sampleEula: '公正なオープンソース / クリーンEULA',
    
    // Input Tabs
    tabPaste: 'テキスト貼付',
    tabUpload: 'PDF / DOCX 取込',
    tabUrl: 'URL取得',
    pastePlaceholder: '利用規約、プライバシーポリシー、または契約書の全文をここに貼り付けてください...',
    urlPlaceholder: 'https://example.com/terms',
    fetchBtn: '規約を取得',
    fetchingBtn: 'Webページを取得中...',
    uploadDragText: 'ファイルをここにドロップまたは参照',
    uploadSupported: '.PDF, .DOCX, .TXT, .MD, .HTML 対応（最大60,000文字）',
    uploadSuccess: 'ファイルが正常に読み込まれました',
    
    // Privacy Shield & Counters
    privacyShield: 'プライバシーシールド',
    privacyOn: '有効 (個人情報マスク済)',
    privacyOff: '無効',
    privacyNote: '名前、メール、電話番号、IDなどをブラウザ上で自動的に保護します。',
    privacyMaskedCount: '個の機密情報をローカルでマスク保護',
    words: '単語',
    chars: '文字',
    
    // Action Buttons
    analyzeBtn: '契約書を分析する',
    analyzingBtn: '契約を監査中...',
    reAnalyzeBtn: '再分析',
    clearBtn: 'クリア',
    
    // Diff Mode
    diffTitle: '契約書のバージョン比較',
    diffSubtitle: '2つの規約間で、新設された不当条項や隠れた変更点、健全性スコアの変動を検知します。',
    diffDocA: '元の規約 (バージョン 1)',
    diffDocB: '更新・更新後の規約 (バージョン 2)',
    diffPlaceholderA: '元の契約書を貼り付け...',
    diffPlaceholderB: '更新された契約書を貼り付け...',
    diffCompareBtn: '両バージョンを比較',
    diffComparingBtn: 'バージョンを比較中...',
    diffLoadSample: 'サンプル比較を読み込む',
    
    // Results
    resultsComplete: '契約書の読み取り完了',
    resultsClauses: '条項。曖昧さゼロ。',
    copySummary: '要約をコピー',
    copied: 'コピー完了',
    legalNotices: '法的通知状',
    printPdf: 'PDF印刷 / 保存',
    shareReport: '共有',
    
    // Filters & Search
    filterAll: 'すべての条項',
    filterRed: '警告 (高リスク)',
    filterYellow: '注意',
    filterGreen: '標準',
    searchPlaceholder: '条項やキーワードを検索...',
    noMatches: '一致する条項がありません。',
    resetFilter: 'フィルターをリセット',
    
    // Clause Card
    clauseNumber: '条項',
    whatToDo: '対策・対処法:',
    counterClause: '修正対案',
    
    // Verdict Card
    verdictSafe: '署名しても安全',
    verdictNegotiate: 'まず条件交渉を推奨',
    verdictDoNotSign: '現状のまま署名不可',
    verdictTitle: '総合判定',
    checklistTitle: '署名前チェックリスト',
    checklistSubtitle: '同意・署名する前に、以下の重要事項を確認してください:',
    
    // Deadlines & Notices
    deadlinesTitle: '重要期限 & アクション日程',
    deadlinesSubtitle: '解約期限、仲裁オプトアウト期間、請求条件の抽出結果。',
    addToGoogleCal: 'Google カレンダーに追加',
    downloadIcs: '.ICS カレンダーファイルを保存',
    
    // Ask Contract Q&A
    askTitle: 'この契約書に質問する',
    askSubtitle: '条項からの引用に基づき、AIが瞬時に回答します。',
    askPlaceholder: '質問を入力 (例: AI学習にデータを使われますか？解約方法は？)',
    askBtn: '質問する',
    askSample1: '個人データは販売されますか？',
    askSample2: '解約して返金を受けられますか？',
    askSample3: '裁判を起こす権利を放棄させられますか？',
    askSample4: '投稿内容はAIのトレーニングに使用されますか？',
    
    // Modals
    close: '閉じる',
    save: '保存',
    cancel: 'キャンセル',
    emailDraft: 'そのまま送信できる交渉メール文案',
    copyEmail: 'メール文案をコピー',
    redlinePreview: 'バランスの取れた対案条項',
  },

  zh: {
    // Header & Brand
    navAudit: '审计',
    navDiff: '对比 (Diff)',
    navRagPro: 'RAG 专业版 (V2)',
    researchLed: '前沿研究驱动的合同清晰化',
    freeNoLogin: '100% 免费 · 无需登录',
    
    // Hero
    heroBadge: 'AI 通俗语言分析',
    heroTitle: 'TermSight.',
    heroTagline1: '你点击了同意。',
    heroTagline2: '我们为你仔细审读。',
    heroSubtitle: '粘贴法律条文、上传 PDF/DOCX 或获取条款网址，快速排查隐藏的霸王条款。',
    
    // Presets
    sampleTitle: '尝试示例合同：',
    sampleAiSaas: '暗藏陷阱的 AI SaaS（知识产权收割与自动续费）',
    sampleFreelance: '自由职业客户协议',
    sampleEula: '公平开源 / 规范 EULA',
    
    // Input Tabs
    tabPaste: '粘贴文本',
    tabUpload: '上传 PDF / DOCX',
    tabUrl: '获取 URL',
    pastePlaceholder: '在此粘贴完整的服务条款、隐私政策或协议全文...\n\n示例："1. 授权许可：用户授予公司永久、不可撤销、全球范围且免版税的许可..."',
    urlPlaceholder: 'https://example.com/terms',
    fetchBtn: '获取条款',
    fetchingBtn: '正在抓取网页...',
    uploadDragText: '将合同拖拽至此处，或浏览文件',
    uploadSupported: '支持 .PDF, .DOCX, .TXT, .MD, .HTML（最多 60,000 字符）',
    uploadSuccess: '文件加载成功',
    
    // Privacy Shield & Counters
    privacyShield: '隐私防护盾',
    privacyOn: '已开启 (脱敏)',
    privacyOff: '已关闭',
    privacyNote: '在浏览器端自动脱敏姓名、邮箱、电话和证件号。',
    privacyMaskedCount: '项敏感信息已在本地脱敏保护',
    words: '字数',
    chars: '字符',
    
    // Action Buttons
    analyzeBtn: '分析合同',
    analyzingBtn: '正在审计合同...',
    reAnalyzeBtn: '重新分析',
    clearBtn: '清除',
    
    // Diff Mode
    diffTitle: '对比合同版本',
    diffSubtitle: '检测两个协议版本之间新增的掠夺性条款、隐蔽修订以及健康度评分变化。',
    diffDocA: '原始条款 (版本 1)',
    diffDocB: '更新 / 续约条款 (版本 2)',
    diffPlaceholderA: '粘贴原始协议...',
    diffPlaceholderB: '粘贴更新后的协议...',
    diffCompareBtn: '对比两个版本',
    diffComparingBtn: '正在对比版本...',
    diffLoadSample: '加载对比示例',
    
    // Results
    resultsComplete: '合同审读完成',
    resultsClauses: '个条款。清晰透彻。',
    copySummary: '复制摘要',
    copied: '已复制',
    legalNotices: '法律通知函',
    printPdf: '打印 / 保存 PDF',
    shareReport: '分享',
    
    // Filters & Search
    filterAll: '全部条款',
    filterRed: '红牌警告 (高风险)',
    filterYellow: '注意提示',
    filterGreen: '标准合规',
    searchPlaceholder: '搜索条款或关键词...',
    noMatches: '没有匹配的条款。',
    resetFilter: '重置筛选',
    
    // Clause Card
    clauseNumber: '条款',
    whatToDo: '应对建议：',
    counterClause: '修改对案',
    
    // Verdict Card
    verdictSafe: '可安全签署',
    verdictNegotiate: '建议先协商修改',
    verdictDoNotSign: '切勿直接签署',
    verdictTitle: '最终研判结论',
    checklistTitle: '签署前核对清单',
    checklistSubtitle: '在接受或签署前，请仔细核对以下关键事项：',
    
    // Deadlines & Notices
    deadlinesTitle: '关键时间节点与行动时间表',
    deadlinesSubtitle: '提取的取消窗口期、仲裁退出期限及扣费计费规则。',
    addToGoogleCal: '添加到 Google 日历',
    downloadIcs: '下载 .ICS 日历文件',
    
    // Ask Contract Q&A
    askTitle: '就此合同提问',
    askSubtitle: '结合确切条款引用的即时语义解答。',
    askPlaceholder: '输入你的疑问（例如：他们会用我的数据训练 AI 吗？如何取消订阅？）',
    askBtn: '提问',
    askSample1: '他们会出售我的个人数据吗？',
    askSample2: '我可以取消并获得退款吗？',
    askSample3: '我是否放弃了向法院起诉的权利？',
    askSample4: '我的内容会被用于 AI 训练吗？',
    
    // Modals
    close: '关闭',
    save: '保存',
    cancel: '取消',
    emailDraft: '即刻可发送的商务谈判邮件草稿',
    copyEmail: '复制邮件草稿',
    redlinePreview: '平衡对等修改建议',
  },

  pt: {
    // Header & Brand
    navAudit: 'Auditar',
    navDiff: 'Comparar (Diff)',
    navRagPro: 'RAG PRO (V2)',
    researchLed: 'Clareza contratual guiada por pesquisa',
    freeNoLogin: '100% Gratuito · Sem Cadastro',
    
    // Hero
    heroBadge: 'Análise de IA em linguagem simples',
    heroTitle: 'TermSight.',
    heroTagline1: 'Você clicou em aceitar.',
    heroTagline2: 'Nós lemos para você.',
    heroSubtitle: 'Cole o texto jurídico, envie um PDF/DOCX ou informe um link para revelar cláusulas abusivas ocultas.',
    
    // Presets
    sampleTitle: 'Experimente um contrato de exemplo:',
    sampleAiSaas: 'SaaS de IA com armadilha (Apropriação de PI e auto-renovação)',
    sampleFreelance: 'Contrato de Cliente Freelancer',
    sampleEula: 'EULA Justo / Código Aberto Limpo',
    
    // Input Tabs
    tabPaste: 'Colar Texto',
    tabUpload: 'Enviar PDF / DOCX',
    tabUrl: 'Buscar de URL',
    pastePlaceholder: 'Cole os Termos de Serviço, Política de Privacidade ou contrato completo aqui...\n\nExemplo: "1. Licença: O usuário concede à empresa uma licença perpétua e mundial..."',
    urlPlaceholder: 'https://exemplo.com.br/termos-de-uso',
    fetchBtn: 'Buscar Termos',
    fetchingBtn: 'Buscando página...',
    uploadDragText: 'Arraste seu contrato aqui ou procure nos arquivos',
    uploadSupported: 'Suporta .PDF, .DOCX, .TXT, .MD, .HTML (máx. 60.000 caracteres)',
    uploadSuccess: 'Arquivo carregado com sucesso',
    
    // Privacy Shield & Counters
    privacyShield: 'Escudo de Privacidade',
    privacyOn: 'ATIVADO (Dados mascarados)',
    privacyOff: 'DESATIVADO',
    privacyNote: 'Oculta automaticamente nomes, e-mails, telefones e CPFs no próprio navegador.',
    privacyMaskedCount: 'dados confidenciais protegidos localmente',
    words: 'palavras',
    chars: 'caracteres',
    
    // Action Buttons
    analyzeBtn: 'Analisar Contrato',
    analyzingBtn: 'Auditando Contrato...',
    reAnalyzeBtn: 'Reanalisar',
    clearBtn: 'Limpar',
    
    // Diff Mode
    diffTitle: 'Comparar Versões de Contrato',
    diffSubtitle: 'Detecte cláusulas abusivas adicionadas, alterações furtivas e variações na pontuação de saúde legal.',
    diffDocA: 'Termos Originais (Versão 1)',
    diffDocB: 'Termos Atualizados / Renovação (Versão 2)',
    diffPlaceholderA: 'Cole o contrato original...',
    diffPlaceholderB: 'Cole o contrato renovado ou atualizado...',
    diffCompareBtn: 'Comparar Ambas as Versões',
    diffComparingBtn: 'Comparando Versões...',
    diffLoadSample: 'Carregar Exemplo de Comparação',
    
    // Results
    resultsComplete: 'Leitura do contrato concluída',
    resultsClauses: 'cláusulas. Sem rodeios.',
    copySummary: 'Copiar resumo',
    copied: 'Copiado',
    legalNotices: 'Notificações Jurídicas',
    printPdf: 'Imprimir / Salvar PDF',
    shareReport: 'Compartilhar',
    
    // Filters & Search
    filterAll: 'Todas as cláusulas',
    filterRed: 'Alertas Vermelhos',
    filterYellow: 'Atenção',
    filterGreen: 'Padrão',
    searchPlaceholder: 'Buscar cláusulas ou termos...',
    noMatches: 'Nenhuma cláusula encontrada para a busca.',
    resetFilter: 'Redefinir Filtros',
    
    // Clause Card
    clauseNumber: 'CLÁUSULA',
    whatToDo: 'O que fazer:',
    counterClause: 'Contraproposta',
    
    // Verdict Card
    verdictSafe: 'SEGURO PARA ASSINAR',
    verdictNegotiate: 'NEGOCIAR PRIMEIRO',
    verdictDoNotSign: 'NÃO ASSINAR NESTE ESTADO',
    verdictTitle: 'Veredito Executivo',
    checklistTitle: 'Lista de Verificação Prévia',
    checklistSubtitle: 'Verifique estes pontos críticos antes de aceitar ou assinar:',
    
    // Deadlines & Notices
    deadlinesTitle: 'Prazos Principais e Linha do Tempo',
    deadlinesSubtitle: 'Prazos de cancelamento, cancelamento de arbitragem e termos de faturamento extraídos.',
    addToGoogleCal: 'Adicionar ao Google Agenda',
    downloadIcs: 'Baixar arquivo .ICS',
    
    // Ask Contract Q&A
    askTitle: 'Perguntar a este Contrato',
    askSubtitle: 'Respostas semânticas instantâneas com citações exatas das cláusulas.',
    askPlaceholder: 'Faça qualquer pergunta (ex: Podem treinar IA com meus dados? Como cancelo?)',
    askBtn: 'Perguntar',
    askSample1: 'Eles podem vender meus dados pessoais?',
    askSample2: 'Posso cancelar e receber reembolso?',
    askSample3: 'Abro mão de processar na justiça?',
    askSample4: 'Podem usar meu conteúdo para treinar IA?',
    
    // Modals
    close: 'Fechar',
    save: 'Salvar',
    cancel: 'Cancelar',
    emailDraft: 'E-mail de Negociação Pronto para Envio',
    copyEmail: 'Copiar Modelo de E-mail',
    redlinePreview: 'Contraproposta Equilibrada',
  },
};
