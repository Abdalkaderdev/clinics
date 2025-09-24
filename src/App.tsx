import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import QAChecklist from "./components/QAChecklist";

// Safe localStorage access
const getSavedLanguage = () => {
  try {
    return localStorage.getItem("selectedLanguage") || "en";
  } catch {
    return "en";
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/menu"
                  element={
                    <Navigate
                      to={`/menu/${getSavedLanguage()}`}
                      replace
                    />
                  }
                />
                <Route path="/menu/:lang" element={<Menu />} />
                <Route
                  path="/categories"
                  element={
                    <Navigate
                      to={`/categories/${getSavedLanguage()}`}
                      replace
                    />
                  }
                />
                <Route path="/categories/:lang" element={<Categories />} />
                {process.env.NODE_ENV === "development" && (
                  <Route path="/qa-checklist" element={<QAChecklist />} />
                )}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
