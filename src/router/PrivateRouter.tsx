import { Link, Redirect, useRoutes } from "raviger";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import ErrorBoundary from "@/components/errors/ErrorBoundary";
import FallbackErrorPage from "@/components/errors/FallbackErrorPage";

import useSidebarState from "@/hooks/useSidebarState";

import HomePage from "@/pages/HomePage";
import Profile from "@/pages/Profile";
import Consent from "@/pages/consent/Consent";
import ConsentDetail from "@/pages/consent/ConsentDetail";
import HealthLocker from "@/pages/healthLocker/HealthLocker";
import HealthLockerDetail from "@/pages/healthLocker/HealthLockerDetail";
import { ConsentTypes } from "@/types/consent";

import { AppRoutes } from "./types";

const PAGES_WITHOUT_SIDEBAR = ["/session-expired"];

const Routes: AppRoutes = {
  "/": () => <HomePage />,
  "/profile": () => <Profile />,
  "/consents": () => <Consent />,

  "/consents/:id/:type": ({ type, id }) => {
    if (Object.values(ConsentTypes).includes(type)) {
      return <ConsentDetail id={id} type={type} />;
    }
  },
  "/health-locker": () => <HealthLocker />,
  "/health-locker/:id": ({ id }) => <HealthLockerDetail id={id} />,
  "/login": () => <Redirect to="/" />,
  "/register": () => <Redirect to="/" />,
};

export default function PrivateRouter() {
  const pages = useRoutes(Routes) || <FallbackErrorPage />;

  const sidebarOpen = useSidebarState();
  const showSidebar = !PAGES_WITHOUT_SIDEBAR.includes(location.pathname);

  return (
    <SidebarProvider defaultOpen={sidebarOpen} className="bg-gray-100">
      {showSidebar && <AppSidebar />}

      <main
        id="pages"
        className="flex flex-col flex-1 max-w-full min-h-[calc(100svh-(--spacing(4)))] md:m-2 md:peer-data-[state=collapsed]:ml-0 border border-gray-200 rounded-lg shadow-sm bg-gray-50 focus:outline-hidden"
      >
        <div className="relative z-10 flex h-16 bg-white shadow-sm shrink-0 md:hidden">
          <div className="flex items-center">
            <SidebarTrigger />
          </div>
          <Link
            href="/"
            className="flex items-center w-full h-full px-4 md:hidden"
          >
            <img className="w-auto h-8" alt="abdm phr logo" />
          </Link>
        </div>
        <div className="p-3 mt-4" data-cui-page>
          <ErrorBoundary
            fallback={<FallbackErrorPage forError="PAGE_LOAD_ERROR" />}
          >
            {pages}
          </ErrorBoundary>
        </div>
      </main>
    </SidebarProvider>
  );
}
