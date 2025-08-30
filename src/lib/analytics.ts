// Analytics service for Beauty Land Card
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

  constructor() {
    // Initialize analytics
    this.setupErrorTracking();
  }

  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.track('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.track('error', {
        type: 'unhandledrejection',
        reason: event.reason
      });
    });
  }

  track(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va.track(event, properties);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }
  }

  // Track page views
  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  // Track clinic interactions
  trackClinicView(clinicId: number, clinicName: string) {
    this.track('clinic_view', { clinicId, clinicName });
  }

  // Track discount claims
  trackDiscountClaim(clinicId: number, serviceName: string, discountAmount: string) {
    this.track('discount_claim', { 
      clinicId, 
      serviceName, 
      discountAmount,
      timestamp: new Date().toISOString()
    });
  }

  // Track language selection
  trackLanguageSelect(language: string) {
    this.track('language_select', { language });
  }

  // Track form submissions
  trackFormSubmit(formType: string, success: boolean) {
    this.track('form_submit', { formType, success });
  }

  // Track contact interactions
  trackContact(clinicId: number, contactMethod: string) {
    this.track('contact', { clinicId, contactMethod });
  }

  // Get all events (for debugging)
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export individual tracking functions for convenience
export const trackPageView = (page: string) => analytics.trackPageView(page);
export const trackClinicView = (clinicId: number, clinicName: string) => analytics.trackClinicView(clinicId, clinicName);
export const trackDiscountClaim = (clinicId: number, serviceName: string, discountAmount: string) => analytics.trackDiscountClaim(clinicId, serviceName, discountAmount);
export const trackLanguageSelect = (language: string) => analytics.trackLanguageSelect(language);
export const trackFormSubmit = (formType: string, success: boolean) => analytics.trackFormSubmit(formType, success);
export const trackContact = (clinicId: number, contactMethod: string) => analytics.trackContact(clinicId, contactMethod);