import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../i18n';
import { UpdateBanner } from './UpdateBanner';

const updateMocks = vi.hoisted(() => ({
  getAvailableUpdate: vi.fn(),
  applyAvailableUpdate: vi.fn()
}));

vi.mock('../../services/updateService', () => ({
  updateService: updateMocks
}));

describe('UpdateBanner', () => {
  beforeEach(() => {
    updateMocks.getAvailableUpdate.mockReset();
    updateMocks.applyAvailableUpdate.mockReset();
    updateMocks.getAvailableUpdate.mockResolvedValue({
      success: true,
      data: { version: '0.3.0', detectedAt: 123 }
    });
    updateMocks.applyAvailableUpdate.mockResolvedValue({ success: true, data: true });
  });

  afterEach(() => {
    cleanup();
  });

  it('shows the downloaded store version and applies it on request', async () => {
    const user = userEvent.setup();
    render(<UpdateBanner />);

    expect(await screen.findByText('FavGrove 0.3.0 is ready')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Update now' }));
    expect(updateMocks.applyAvailableUpdate).toHaveBeenCalledOnce();
  });

  it('can be dismissed for the current page session', async () => {
    const user = userEvent.setup();
    render(<UpdateBanner />);

    await screen.findByText('FavGrove 0.3.0 is ready');
    await user.click(screen.getByRole('button', { name: 'Remind me later' }));
    expect(screen.queryByText('FavGrove 0.3.0 is ready')).not.toBeInTheDocument();
  });

  it('shows a dismissible error when local update state cannot be read', async () => {
    updateMocks.getAvailableUpdate.mockResolvedValue({ success: false, error: 'Unable to read local storage.' });
    render(<UpdateBanner />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to read local storage.');
  });
});
