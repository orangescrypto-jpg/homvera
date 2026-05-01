// Stub: Replace with your own auth logic (Supabase, Firebase, Clerk, etc.)
export function useAuth(_options?: any) {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: () => {},
    logout: async () => {},
  };
}
