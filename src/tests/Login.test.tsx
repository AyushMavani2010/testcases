import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Page/Login";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

const mockAxios = new MockAdapter(axios);
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-cookie', () => ({
  ...jest.requireActual('react-cookie'),
  useCookies: () => [
    {},
    jest.fn(), 
    jest.fn()
  ]
}));

const renderLogin = () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Login />
    </BrowserRouter>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    mockAxios.reset();
    mockNavigate.mockClear();
  });

  test("renders login form with all elements", () => {
    renderLogin();
    
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login Now")).toBeInTheDocument();
    expect(screen.getByText("Register Now")).toBeInTheDocument();
  });

  test("shows validation errors for empty form submission", async () => {
    renderLogin();
    
    fireEvent.click(screen.getByText("Login Now"));
    
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  test("shows error for invalid email format", async () => {
    renderLogin();
    
    await userEvent.type(screen.getByPlaceholderText("Email"), "invalid-email");
    fireEvent.click(screen.getByText("Login Now"));
    
    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    renderLogin();
    const mockToken = "mock-token";
    const mockUserId = "123";
    
    mockAxios.onPost("http://localhost:5000/login").reply(200, {
      token: mockToken,
      id: mockUserId,
      redirectTo: "/dashboard",
    });

    await userEvent.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "password123");
    
    fireEvent.click(screen.getByText("Login Now"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("handles login failure", async () => {
    renderLogin();
    
    mockAxios.onPost("http://localhost:5000/login").reply(401, {
      message: "Invalid credentials",
    });

    await userEvent.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    
    fireEvent.click(screen.getByText("Login Now"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("toggles password visibility", async () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole('button', { name: '' });
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});