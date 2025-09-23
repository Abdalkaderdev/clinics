import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
const Menu = lazy(() => import("./pages/Menu"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Categories = lazy(() => import("./pages/Categories"));
const QAChecklist = lazy(() => import("./components/QAChecklist"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true" />
                    <span className="sr-only">Loading application...</span>
                    <p>Loading...</p>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/menu"
                  element={
                    <Navigate
                      to={`/menu/${localStorage.getItem("selectedLanguage") || "en"}`}
                      replace
                    />
                  }
                />
                <Route path="/menu/:lang" element={<Menu />} />
                <Route
                  path="/categories"
                  element={
                    <Navigate
                      to={`/categories/${localStorage.getItem("selectedLanguage") || "en"}`}
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
