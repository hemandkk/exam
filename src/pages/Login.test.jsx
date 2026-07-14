import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import API from '../services/api';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}), { virtual: true });

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  persistAuthToken: jest.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a friendly error toast when login fails', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    API.post.mockRejectedValueOnce({ status: 401 });

    const { container } = render(<Login />);

    const inputs = container.querySelectorAll('input');
    await userEvent.type(inputs[0], 'bad@example.com');
    await userEvent.type(inputs[1], 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(alertSpy).not.toHaveBeenCalled();
  });
});
