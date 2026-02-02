import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
    it('renders with default variant (primary)', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-indigo-600');
    });

    it('renders with secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button', { name: /secondary/i });
        expect(button).toHaveClass('bg-indigo-50');
        expect(button).toHaveClass('text-indigo-700');
    });

    it('renders with outline variant', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button', { name: /outline/i });
        expect(button).toHaveClass('border');
        expect(button).toHaveClass('bg-white');
    });

    it('renders with ghost variant', () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByRole('button', { name: /ghost/i });
        expect(button).toHaveClass('bg-transparent');
    });

    it('renders with small size', () => {
        render(<Button size="sm">Small</Button>);
        const button = screen.getByRole('button', { name: /small/i });
        expect(button).toHaveClass('px-3');
        expect(button).toHaveClass('py-1.5');
    });

    it('renders with medium size (default)', () => {
        render(<Button>Medium</Button>);
        const button = screen.getByRole('button', { name: /medium/i });
        expect(button).toHaveClass('px-4');
        expect(button).toHaveClass('py-2');
    });

    it('renders with large size', () => {
        render(<Button size="lg">Large</Button>);
        const button = screen.getByRole('button', { name: /large/i });
        expect(button).toHaveClass('px-4.5');
        expect(button).toHaveClass('py-2.5');
    });

    it('renders with xl size', () => {
        render(<Button size="xl">Extra Large</Button>);
        const button = screen.getByRole('button', { name: /extra large/i });
        expect(button).toHaveClass('px-5');
        expect(button).toHaveClass('py-3');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);
        const button = screen.getByRole('button', { name: /custom/i });
        expect(button).toHaveClass('custom-class');
    });

    it('has dark mode classes for secondary variant', () => {
        render(<Button variant="secondary">Dark Mode</Button>);
        const button = screen.getByRole('button', { name: /dark mode/i });
        expect(button).toHaveClass('dark:bg-indigo-900/30');
        expect(button).toHaveClass('dark:text-indigo-400');
    });
});
