import { Navigation } from './Navigation';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navigation />
            <main>
                {children}
            </main>
        </div>
    );
}
