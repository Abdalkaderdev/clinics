import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { t } from "@/lib/translations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  language: string;
  isRTL?: boolean;
  clinicName?: string;

}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  language,
  isRTL,
  clinicName,

}) => {
  const location = useLocation();
  const lang = language as "en" | "ar" | "ku";

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: t("home", lang),
        href: "/",
        icon: <Home className="w-3 h-3" />,
      },
    ];

    if (location.pathname.includes("/categories")) {
      breadcrumbs.push({
        label: t("partnersTitle", lang),
        href: `/categories/${language}`,
      });
    }

    if (location.pathname.includes("/menu")) {
      breadcrumbs.push({
        label: t("partnersTitle", lang),
        href: `/categories/${language}`,
      });
      
      if (clinicName) {
        breadcrumbs.push({
          label: clinicName,
          href: location.pathname + location.search,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <div className={`bg-slate-50 border-b border-slate-200 px-4 py-2 ${isRTL ? "rtl" : "ltr"}`}>
      <Breadcrumb>
        <BreadcrumbList className={isRTL ? "flex-row-reverse space-x-reverse" : ""}>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.href}-${index}`}>
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="flex items-center gap-1 text-slate-600">
                    {crumb.icon}
                    <span className="truncate max-w-[200px]">{crumb.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={crumb.href} 
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {crumb.icon}
                      <span className="truncate max-w-[150px]">{crumb.label}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;