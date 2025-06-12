import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useUserStore } from '../../store/userStore';
import { OfflineBanner } from '../OfflineBanner';

// Mock next/dynamic if used
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => {
    return function DynamicComponent() {
      return <div />;
    };
  }),
}));

// Mock the user store
vi.mock('../../store/userStore', () => ({
  useUserStore: vi.fn(() => ({
    isOnline: true,
    isManualOffline: false,
    setOnlineStatus: vi.fn(),
    toggleManualOffline: vi.fn(),
  })),
}));

// Add custom matchers
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

describe('OfflineBanner', () => {
  it('does not render when online', () => {
    render(<OfflineBanner />);
    expect(screen.queryByText(/offline/i)).toBeNull();
  });

  it('renders when offline', () => {
    (useUserStore as any).mockImplementation(() => ({
      isOnline: false,
      isManualOffline: false,
    }));
    render(<OfflineBanner />);
    expect(screen.getByText(/offline/i)).toBeVisible();
  });

  it('renders when manually offline', () => {
    (useUserStore as any).mockImplementation(() => ({
      isOnline: true,
      isManualOffline: true,
    }));
    render(<OfflineBanner />);
    expect(screen.getByText(/offline/i)).toBeVisible();
  });
});
