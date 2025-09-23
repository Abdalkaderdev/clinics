import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface QACheckItem {
  id: string;
  category: string;
  description: string;
  completed: boolean;
  critical: boolean;
  notes?: string;
}

const qaChecklist: QACheckItem[] = [
  // Branding & Content
  {
    id: "brand-title",
    category: "Branding",
    description:
      'Site title shows "Beauty Land Card — Discounts & freebies at 12 partner clinics"',
    completed: false,
    critical: true,
  },
  {
    id: "brand-hero",
    category: "Branding",
    description: "Hero section displays correct tagline and 12 clinics message",
    completed: false,
    critical: true,
  },
  {
    id: "brand-logo",
    category: "Branding",
    description: 'Logo uses pink for "beauty" and blue for "land card"',
    completed: false,
    critical: true,
  },
  {
    id: "no-restaurant",
    category: "Branding",
    description: "No restaurant-related content remains on the site",
    completed: false,
    critical: true,
  },

  // SEO & Meta Tags
  {
    id: "og-tags",
    category: "SEO",
    description: "Open Graph meta tags are present and correct",
    completed: false,
    critical: true,
  },
  {
    id: "twitter-tags",
    category: "SEO",
    description: "Twitter Card meta tags are present and correct",
    completed: false,
    critical: true,
  },
  {
    id: "json-ld",
    category: "SEO",
    description: "JSON-LD structured data is present and valid",
    completed: false,
    critical: false,
  },

  // Performance & Assets
  {
    id: "webp-images",
    category: "Performance",
    description: "Images are served in WebP format when supported",
    completed: false,
    critical: false,
  },
  {
    id: "cache-headers",
    category: "Performance",
    description: "Static assets have proper cache headers",
    completed: false,
    critical: false,
  },

  // Accessibility
  {
    id: "skip-link",
    category: "Accessibility",
    description: "Skip to content link is present and functional",
    completed: false,
    critical: true,
  },
  {
    id: "focus-styles",
    category: "Accessibility",
    description: "Keyboard focus styles are visible and accessible",
    completed: false,
    critical: true,
  },
  {
    id: "color-contrast",
    category: "Accessibility",
    description: "Text color contrast meets WCAG AA standards",
    completed: false,
    critical: true,
  },

  // Security
  {
    id: "security-headers",
    category: "Security",
    description: "Security headers are present (CSP, X-Frame-Options, etc.)",
    completed: false,
    critical: true,
  },
  {
    id: "csp-working",
    category: "Security",
    description: "Content Security Policy doesn't break functionality",
    completed: false,
    critical: true,
  },

  // Analytics
  {
    id: "analytics-events",
    category: "Analytics",
    description: "Analytics events fire correctly (page views, interactions)",
    completed: false,
    critical: false,
  },
  {
    id: "error-tracking",
    category: "Analytics",
    description: "Error tracking captures JavaScript errors",
    completed: false,
    critical: false,
  },

  // Functionality
  {
    id: "language-switching",
    category: "Functionality",
    description: "Language switching works correctly",
    completed: false,
    critical: true,
  },
  {
    id: "clinic-navigation",
    category: "Functionality",
    description: "Clinic navigation and discount display works",
    completed: false,
    critical: true,
  },
  {
    id: "responsive-design",
    category: "Functionality",
    description: "Site is responsive across different screen sizes",
    completed: false,
    critical: true,
  },
];

const QAChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<QACheckItem[]>(qaChecklist);
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const _updateNotes = (id: string, notes: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const criticalCompleted = checklist.filter(
    (item) => item.critical && item.completed
  ).length;
  const criticalTotal = checklist.filter((item) => item.critical).length;

  const filteredChecklist = showCompleted
    ? checklist
    : checklist.filter((item) => !item.completed);

  const categories = [...new Set(checklist.map((item) => item.category))];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Beauty Land Card QA Checklist
        </h1>
        <p className="text-gray-600 mb-4">
          Complete testing checklist for production deployment
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <Badge
            variant={
              criticalCompleted === criticalTotal ? "default" : "destructive"
            }
          >
            Critical: {criticalCompleted}/{criticalTotal}
          </Badge>
          <Badge variant="outline">
            Total: {completedCount}/{checklist.length}
          </Badge>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={showCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompleted(true)}
          >
            Show All
          </Button>
          <Button
            variant={!showCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompleted(false)}
          >
            Show Pending
          </Button>
        </div>
      </div>

      {categories.map((category) => {
        const categoryItems = filteredChecklist.filter(
          (item) => item.category === category
        );
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category}
                <Badge variant="outline">
                  {categoryItems.filter((item) => item.completed).length}/
                  {categoryItems.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${item.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {item.description}
                      </span>
                      {item.critical && (
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      )}
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader>
          <CardTitle>QA Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Critical items completed:</span>
              <span
                className={
                  criticalCompleted === criticalTotal
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {criticalCompleted}/{criticalTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Overall completion:</span>
              <span className="font-semibold">
                {Math.round((completedCount / checklist.length) * 100)}%
              </span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> All critical items must be completed
                before production deployment. Non-critical items can be
                addressed in follow-up releases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QAChecklist;
