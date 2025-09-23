import React from "react";
import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";

interface WorkingHoursProps {
  language: "en" | "ku" | "ar";
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

const workingHoursData = {
  en: {
    title: "Working Hours",
    daily: "Sun-Wed, Sat",
    hours: "12:00 PM - 12:00 AM",
    thursday: "Thursday: 12:00 PM - 2:00 AM",
    friday: "Friday: 3:00 PM - 1:00 AM",
    noDaysOff: "No days off",
    open: "Open",
    closed: "Closed",
  },
  ku: {
    title: "کاتی کارکردن",
    daily: "یەکشەممە-چوارشەممە، شەممە",
    hours: "١٢:٠٠ دواتر لە نیوەڕۆ - ١٢:٠٠ شەو",
    thursday: "پێنجشەممە: ١٢:٠٠ دواتر لە نیوەڕۆ - ٢:٠٠ بەیانی",
    friday: "هەینی: ٣:٠٠ دواتر لە نیوەڕۆ - ١:٠٠ بەیانی",
    noDaysOff: "هیچ ڕۆژێک دانەبەزێنرێت",
    open: "کراوە",
    closed: "داخراوە",
  },
  ar: {
    title: "ساعات العمل",
    daily: "الأحد-الأربعاء، السبت",
    hours: "١٢:٠٠ ظهراً - ١٢:٠٠ منتصف الليل",
    thursday: "الخميس: ١٢:٠٠ ظهراً - ٢:٠٠ صباحاً",
    friday: "الجمعة: ٣:٠٠ مساءً - ١:٠٠ صباحاً",
    noDaysOff: "لا توجد أيام إجازة",
    open: "مفتوح",
    closed: "مغلق",
  },
};

const WorkingHours: React.FC<WorkingHoursProps> = ({
  language,
  className = "",
  variant = "default",
}) => {
  const data = workingHoursData[language];
  const isArabic = language === "ar";
  const isKurdish = language === "ku";

  if (variant === "compact") {
    return (
      <div className={`flex flex-col items-center gap-1 text-sm ${className}`}>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span
            className={`${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
          >
            {data.daily}: {data.hours}
          </span>
        </div>
        <div
          className={`text-xs text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
        >
          {data.thursday}
        </div>
        <div
          className={`text-xs text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
        >
          {data.friday}
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <Card
        className={`bg-card backdrop-blur-sm border border-border hover:border-primary transition-all duration-300 ${className}`}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h3
              className={`font-semibold text-foreground text-lg ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
            >
              {data.title}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span
                className={`text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
              >
                {data.daily}
              </span>
              <span
                className={`font-semibold text-primary ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
              >
                {data.hours}
              </span>
            </div>

            <div className="text-sm space-y-1">
              <div
                className={`text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
              >
                {data.thursday}
              </div>
              <div
                className={`text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
              >
                {data.friday}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
              >
                {data.noDaysOff}
              </span>
              <span
                className={`text-green-500 font-semibold ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
              >
                {data.open}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant (same as current Index page style)
  return (
    <Card
      className={`bg-card backdrop-blur-sm border border-border hover:border-primary transition-all duration-300 ${className}`}
    >
      <CardContent className="p-6 text-center">
        <div className="text-3xl mb-3">🕐</div>
        <h3
          className={`font-semibold text-foreground mb-2 ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
        >
          {data.title}
        </h3>
        <p
          className={`text-[hsl(39_92%_53%)] mb-1 ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
        >
          {data.daily}: {data.hours}
        </p>
        <div
          className={`text-xs text-muted-foreground mb-2 space-y-1 ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
        >
          <p>{data.thursday}</p>
          <p>{data.friday}</p>
        </div>
        <p
          className={`text-sm text-muted-foreground ${isArabic ? "font-arabic" : ""} ${isKurdish ? "font-kurdish" : ""}`}
        >
          {data.noDaysOff}
        </p>
      </CardContent>
    </Card>
  );
};

export default WorkingHours;
