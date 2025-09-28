import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('renders with outline variant', () => {
    render(<Button variant='outline'>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('border', 'border-input', 'bg-background');
  });

  it('renders with small size', () => {
    render(<Button size='sm'>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3');
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });
});
