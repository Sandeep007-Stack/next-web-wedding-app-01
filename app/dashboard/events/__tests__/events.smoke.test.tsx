import { render, screen } from '@testing-library/react';
import { Providers } from '@/components/Providers';
import EventsPage from '../../events/page';

function renderWithProviders(ui: React.ReactNode) {
  return render(<Providers>{ui}</Providers>);
}

describe('EventsPage', () => {
  it('renders empty state CTA', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText(/No events yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Event/i })).toBeInTheDocument();
  });
});
