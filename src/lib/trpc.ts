// Stub: tRPC removed. All queries return empty data, all mutations do nothing.
const handler = {
  get(_: any, prop: string) {
    if (prop === "useQuery") return () => ({ data: undefined, isLoading: false, error: null });
    if (prop === "useMutation") return () => ({ mutate: () => {}, mutateAsync: async () => {}, isPending: false, error: null });
    if (prop === "useUtils") return () => new Proxy({}, handler);
    if (prop === "useInfiniteQuery") return () => ({ data: undefined, isLoading: false, fetchNextPage: () => {}, hasNextPage: false });
    return new Proxy({}, handler);
  },
};

export const trpc = new Proxy({}, handler);
