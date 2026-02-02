import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
    it('renders children correctly', () => {
        render(
            <Card>
                <p>Card content</p>
            </Card>
        );
        expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with title', () => {
        render(
            <Card title="Test Title">
                <p>Content</p>
            </Card>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with subtitle', () => {
        render(
            <Card subtitle="Test Subtitle">
                <p>Content</p>
            </Card>
        );
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders with both title and subtitle', () => {
        render(
            <Card title="Title" subtitle="Subtitle">
                <p>Content</p>
            </Card>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <Card className="custom-class">
                <p>Content</p>
            </Card>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has dark mode classes', () => {
        const { container } = render(
            <Card>
                <p>Content</p>
            </Card>
        );
        expect(container.firstChild).toHaveClass('dark:bg-gray-900');
        expect(container.firstChild).toHaveClass('dark:border-gray-800');
    });
});
