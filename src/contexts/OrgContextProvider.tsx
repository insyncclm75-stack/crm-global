import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

interface OrgContextType {
  userOrgId: string | null;
  effectiveOrgId: string | null;
  isPlatformAdmin: boolean;
  isImpersonating: boolean;
  isLoading: boolean;
  setImpersonatedOrgId: (orgId: string | null) => void;
  clearImpersonation: () => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

const IMPERSONATION_KEY = "impersonated_org_id";

interface OrgContextProviderProps {
  children: ReactNode;
}

/**
 * Centralized Org Context Provider - Single source of truth for org context
 * Uses AuthProvider's session to trigger org fetch
 * Eliminates duplicate org context fetches across components
 */
export function OrgContextProvider({ children }: OrgContextProviderProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [userOrgId, setUserOrgId] = useState<string | null>(null);
  const [impersonatedOrgId, setImpersonatedOrgIdState] = useState<string | null>(null);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize impersonation from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(IMPERSONATION_KEY);
    if (stored) {
      setImpersonatedOrgIdState(stored);
    }
  }, []);

  // Fetch profile data when user changes
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setUserOrgId(null);
      setIsPlatformAdmin(false);
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const fetchProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("org_id, is_platform_admin")
          .eq("id", user.id)
          .single();

        if (!mounted) return;

        if (error) {
          console.error("[OrgContext] Failed to fetch profile:", error);
          setIsLoading(false);
          return;
        }

        setUserOrgId(profile?.org_id || null);
        setIsPlatformAdmin(profile?.is_platform_admin || false);

        // Clear impersonation if user is not platform admin
        if (!profile?.is_platform_admin && impersonatedOrgId) {
          localStorage.removeItem(IMPERSONATION_KEY);
          setImpersonatedOrgIdState(null);
        }
      } catch (err) {
        console.error("[OrgContext] Error fetching profile:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, impersonatedOrgId]);

  const setImpersonatedOrgId = useCallback((orgId: string | null) => {
    if (orgId) {
      localStorage.setItem(IMPERSONATION_KEY, orgId);
    } else {
      localStorage.removeItem(IMPERSONATION_KEY);
    }
    setImpersonatedOrgIdState(orgId);
  }, []);

  const clearImpersonation = useCallback(() => {
    localStorage.removeItem(IMPERSONATION_KEY);
    setImpersonatedOrgIdState(null);
  }, []);

  // Determine effective org ID
  const effectiveOrgId = isPlatformAdmin && impersonatedOrgId 
    ? impersonatedOrgId 
    : userOrgId;

  const value: OrgContextType = {
    userOrgId,
    effectiveOrgId,
    isPlatformAdmin,
    isImpersonating: isPlatformAdmin && !!impersonatedOrgId,
    isLoading: authLoading || isLoading,
    setImpersonatedOrgId,
    clearImpersonation,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrgContextProvider() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error("useOrgContextProvider must be used within an OrgContextProvider");
  }
  return context;
}
