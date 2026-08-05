import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  workspaceApi,
  WorkspaceResponse,
} from "../api/workspaceApi";

import { BrandLogo } from "./BrandLogo";

import {
  BookOpen,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  Search,
  Trophy,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const [workspaces, setWorkspaces] = useState<
    WorkspaceResponse[]
  >([]);

  const [isClassroomsOpen, setIsClassroomsOpen] =
    useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [dropdownSearch, setDropdownSearch] =
    useState("");

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const isTeacher =
    user?.role?.toUpperCase() === "TEACHER";

  const isStudent =
    user?.role?.toUpperCase() === "STUDENT";

  const dashboardLink = isTeacher
    ? "/teacher/dashboard"
    : "/student/dashboard";

  const fetchWorkspacesList = async () => {
    if (!user?.id) {
      setWorkspaces([]);
      return;
    }

    try {
      let data: WorkspaceResponse[] = [];

      if (isTeacher) {
        data =
          await workspaceApi.getMyWorkspaces();
      } else if (isStudent) {
        data =
          await workspaceApi.getJoinedWorkspaces();
      }

      setWorkspaces(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        "Error loading workspaces:",
        error,
      );

      setWorkspaces([]);
    }
  };

  useEffect(() => {
    fetchWorkspacesList();
  }, [user?.id, user?.role]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsClassroomsOpen(false);
    setDropdownSearch("");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsClassroomsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleLogout = () => {
    logout();

    setWorkspaces([]);

    addToast(
      "Logged out successfully.",
      "info",
    );

    navigate("/login");
  };

  const normalizedSearch =
    dropdownSearch.trim().toLowerCase();

  const filteredWorkspaces =
    workspaces.filter((workspace) => {
      const workspaceName =
        workspace.name?.toLowerCase() || "";

      const workspaceSubject =
        workspace.subject?.toLowerCase() || "";

      return (
        workspaceName.includes(
          normalizedSearch,
        ) ||
        workspaceSubject.includes(
          normalizedSearch,
        )
      );
    });

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/20 selection:text-indigo-200">
      {/* Top Navbar */}
      <header
        className="sticky top-0 z-50 glass-nav border-b border-zinc-800/80 bg-zinc-950/80"
        id="main_header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand and Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              to={dashboardLink}
              className="inline-block shrink-0"
            >
              <BrandLogo
                size="sm"
                showSubtitle
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to={dashboardLink}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  location.pathname ===
                  dashboardLink
                    ? "bg-zinc-800/90 text-zinc-100 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              {/* Classroom Dropdown */}
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsClassroomsOpen(
                      (current) => !current,
                    )
                  }
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    location.pathname.includes(
                      "/workspace",
                    )
                      ? "bg-zinc-800/90 text-zinc-100 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />

                  <span>Classrooms</span>

                  <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {workspaces.length}
                  </span>

                  <ChevronDown
                    className={`w-3 h-3 text-zinc-500 transition-transform ${
                      isClassroomsOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isClassroomsOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 6,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                      className="absolute left-0 mt-1.5 w-72 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xl p-2 z-50"
                    >
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />

                        <input
                          type="text"
                          placeholder="Filter classrooms..."
                          value={dropdownSearch}
                          onChange={(event) =>
                            setDropdownSearch(
                              event.target.value,
                            )
                          }
                          className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-medium"
                        />
                      </div>

                      <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5">
                        {filteredWorkspaces.length ===
                        0 ? (
                          <div className="p-3 text-center text-xs text-zinc-500 font-medium">
                            No classrooms found
                          </div>
                        ) : (
                          filteredWorkspaces.map(
                            (workspace) => {
                              const isActive =
                                location.pathname.includes(
                                  `/workspace/${workspace.id}`,
                                );

                              return (
                                <Link
                                  key={workspace.id}
                                  to={`/workspace/${workspace.id}`}
                                  onClick={() =>
                                    setIsClassroomsOpen(
                                      false,
                                    )
                                  }
                                  className={`flex flex-col p-2 rounded-lg text-xs transition-colors ${
                                    isActive
                                      ? "bg-zinc-800 text-zinc-100 font-medium"
                                      : "hover:bg-zinc-800/50 text-zinc-300"
                                  }`}
                                >
                                  <span className="font-medium truncate">
                                    {workspace.name}
                                  </span>

                                  <span className="text-[10px] text-zinc-500 truncate">
                                    {workspace.subject}
                                  </span>
                                </Link>
                              );
                            },
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Leaderboard */}
              <Link
                to="/leaderboard"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  location.pathname ===
                  "/leaderboard"
                    ? "bg-zinc-800/90 text-zinc-100 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Leaderboard</span>
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* User Information */}
            <div className="hidden min-w-0 items-center gap-2 xl:flex">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 text-xs font-medium">
                {user?.name?.charAt(0) || (
                  <UserIcon className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex min-w-0 max-w-32 flex-col text-left">
                <span className="truncate text-xs font-medium leading-none text-zinc-200">
                  {user?.name}
                </span>

                <span className="text-[10px] text-zinc-500 font-mono capitalize mt-0.5">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              id="logout_btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />

              <span className="hidden sm:inline">
                Sign Out
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(
                  (current) => !current,
                )
              }
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors md:hidden cursor-pointer border border-zinc-800"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="max-h-[calc(100vh-3.5rem)] space-y-2 overflow-y-auto border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 lg:hidden"
            >
              <div className="flex items-center pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs font-medium">
                    {user?.name?.charAt(0) || (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-medium text-zinc-200 block">
                      {user?.name}
                    </span>

                    <span className="text-[10px] text-zinc-500 capitalize">
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <Link
                  to={dashboardLink}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    location.pathname ===
                    dashboardLink
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    location.pathname ===
                    "/leaderboard"
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Leaderboard
                </Link>

                <div className="pt-2">
                  <span className="text-[10px] font-medium text-zinc-500 uppercase px-3 block mb-1">
                    Your Classrooms (
                    {workspaces.length})
                  </span>

                  {workspaces.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-zinc-500">
                      No classrooms available
                    </p>
                  ) : (
                    workspaces.map(
                      (workspace) => (
                        <Link
                          key={workspace.id}
                          to={`/workspace/${workspace.id}`}
                          onClick={() =>
                            setIsMobileMenuOpen(
                              false,
                            )
                          }
                          className="flex min-w-0 flex-col rounded-lg px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-zinc-900"
                        >
                          <span className="truncate font-medium">
                            {workspace.name}
                          </span>

                          <span className="truncate text-[10px] text-zinc-500">
                            {workspace.subject}
                          </span>
                        </Link>
                      ),
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="flex flex-col items-center gap-2 font-medium sm:flex-row">
            <BrandLogo
              size="sm"
              showSubtitle={false}
            />

            <span className="text-[10px] leading-5 text-zinc-500 sm:ml-2 sm:text-[11px]">
              &copy; 2026. Virtual Classroom Platform.
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
            <Link
              to={dashboardLink}
              className="hover:text-zinc-300 transition-colors"
            >
              Dashboard
            </Link>

            <span>•</span>

            <Link
              to="/leaderboard"
              className="hover:text-zinc-300 transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};