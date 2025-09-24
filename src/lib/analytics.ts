// Analytics service for Beauty Land Card
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

// Sanitize user input to prevent log injection with depth protection
function sanitizeInput(input: unknown, depth = 0, visited = new WeakSet()): unknown {
  // Prevent infinite recursion
  if (depth > 10) return '[Max Depth Reached]';
  
  if (typeof input === "string") {
    return input
      .replace(/[\r\n]/g, " ") // Remove newlines
      .replace(/[%{}]/g, "_") // Replace dangerous chars
      .replace(/[\cA-\cZ]/g, "") // Remove control chars
      .replace(/[\x7F-\x9F]/g, ""); // Remove extended control chars
  }
  
  if (typeof input === "object" && input !== null) {
    // Prevent circular references
    if (visited.has(input)) return '[Circular Reference]';
    visited.add(input);
    
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      const sanitizedKey = typeof key === 'string' ? key.replace(/[^a-zA-Z0-9_]/g, '_') : String(key);
      sanitized[sanitizedKey] = sanitizeInput(value, depth + 1, visited);
    }
    return sanitized;
  }
  return input;
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
    window.addEventListener("error", (event) => {
      this.track("error", {
        message: sanitizeInput(event.message),
        filename: sanitizeInput(event.filename),
        lineno: event.lineno,
        colno: event.colno,
        error: sanitizeInput(event.error?.stack),
      });
    });

    // Track unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.track("error", {
        type: "unhandledrejection",
        reason: sanitizeInput(event.reason),
      });
    });
  }

  track(event: string, properties: Record<string, unknown> = {}) {
    if (!this.isEnabled) return;

    const timestamp = Date.now();
    const analyticsEvent: AnalyticsEvent = {
      event: sanitizeInput(event) as string,
      properties: sanitizeInput({
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }) as Record<string, unknown>,
      timestamp,
    };

    this.events.push(analyticsEvent);

    // Send to Vercel Analytics if available (non-blocking)
    try {
      if (typeof window !== "undefined" && 'va' in window && typeof (window as { va?: { track: (event: string, properties: Record<string, unknown>) => void } }).va?.track === 'function') {
        (window as { va: { track: (event: string, properties: Record<string, unknown>) => void } }).va.track(event, properties);
      }
    } catch (error) {
      // Silently fail - don't block user interactions
      console.warn('Analytics tracking failed:', error);
    }

    // Log to console in development with sanitized data
    if (process.env.NODE_ENV === "development") {
      console.log("Analytics Event:", sanitizeInput(analyticsEvent));
    }
  }

  // Track page views
  trackPageView(page: string) {
    this.track("page_view", { page });
  }

  // Track clinic interactions
  trackClinicView(clinicId: number, clinicName: string) {
    this.track("clinic_view", { clinicId, clinicName });
  }

  // Track discount claims
  trackDiscountClaim(
    clinicId: number,
    serviceName: string,
    discountAmount: string
  ) {
    this.track("discount_claim", {
      clinicId,
      serviceName,
      discountAmount,
      timestamp: new Date().toISOString(),
    });
  }

  // Track language selection
  trackLanguageSelect(language: string) {
    this.track("language_select", { language });
  }

  // Track form submissions
  trackFormSubmit(formType: string, success: boolean) {
    this.track("form_submit", { formType, success });
  }

  // Track contact interactions
  trackContact(clinicId: number, contactMethod: string) {
    this.track("contact", { clinicId, contactMethod });
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
export const trackClinicView = (clinicId: number, clinicName: string) =>
  analytics.trackClinicView(clinicId, clinicName);
export const trackDiscountClaim = (
  clinicId: number,
  serviceName: string,
  discountAmount: string
) => analytics.trackDiscountClaim(clinicId, serviceName, discountAmount);
export const trackLanguageSelect = (language: string) =>
  analytics.trackLanguageSelect(language);
export const trackFormSubmit = (formType: string, success: boolean) =>
  analytics.trackFormSubmit(formType, success);
export const trackContact = (clinicId: number, contactMethod: string) =>
  analytics.trackContact(clinicId, contactMethod);
