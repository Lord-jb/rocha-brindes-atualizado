// FILE: src/components/Providers.solid.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import type { ParentComponent } from 'solid-js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (era cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Providers: ParentComponent = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

export default Providers;
