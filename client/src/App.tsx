import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './router/mainRouter';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app-container">
                <Router />
            </div>
        </QueryClientProvider>
    );
}

export default App;
