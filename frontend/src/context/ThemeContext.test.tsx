import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { act } from 'react';

// Componente de prueba que usa el hook useTheme
function TestComponent() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
}

describe('ThemeContext', () => {
    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
        // Remover la clase dark del html
        document.documentElement.classList.remove('dark');
    });

    it('provides default theme as light', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('toggles theme from light to dark', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const toggleButton = screen.getByRole('button', { name: /toggle/i });

        act(() => {
            toggleButton.click();
        });

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('toggles theme from dark to light', () => {
        // Establecer tema oscuro inicialmente
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');

        const toggleButton = screen.getByRole('button', { name: /toggle/i });

        act(() => {
            toggleButton.click();
        });

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('persists theme in localStorage', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const toggleButton = screen.getByRole('button', { name: /toggle/i });

        act(() => {
            toggleButton.click();
        });

        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('loads theme from localStorage on mount', () => {
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('applies dark class to html element when theme is dark', () => {
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from html element when theme is light', () => {
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const toggleButton = screen.getByRole('button', { name: /toggle/i });

        act(() => {
            toggleButton.click();
        });

        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
