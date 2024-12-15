import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Registration from "../Page/Registration";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

const mockAxios = new MockAdapter(axios);
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderRegistration = () => {
  render(
    <BrowserRouter>
      <Registration />
    </BrowserRouter>
  );
};

describe("Registration Component", () => {
  beforeEach(() => {
    mockAxios.reset();
    mockNavigate.mockClear();
  });

  test("renders registration form with all elements", () => {
    renderRegistration();
    
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText("Select Gender")).toBeInTheDocument();
    expect(screen.getByText("Registration Now")).toBeInTheDocument();
  });

  test("handles successful registration", async () => {
    renderRegistration();
    const mockUserId = "123";
    
    mockAxios.onPost("http://localhost:5000/register").reply(200, {
      id: mockUserId,
    });

    await userEvent.type(screen.getByPlaceholderText("Username"), "testuser");
    await userEvent.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "password123");
    await userEvent.type(screen.getByPlaceholderText("Confirm Password"), "password123");
    
    const genderSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(genderSelect, "male");

    fireEvent.click(screen.getByText("Registration Now"));

    await waitFor(() => {
      expect(localStorage.getItem("userId")).toBe(mockUserId);
    });
  });

  test("shows alert when passwords don't match", async () => {
    renderRegistration();
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await userEvent.type(screen.getByPlaceholderText("Password"), "password123");
    await userEvent.type(screen.getByPlaceholderText("Confirm Password"), "different");
    
    fireEvent.click(screen.getByText("Registration Now"));

    expect(alertMock).toHaveBeenCalledWith("Passwords do not match!");
    alertMock.mockRestore();
  });

  test("handles registration failure", async () => {
    renderRegistration();
    
    mockAxios.onPost("http://localhost:5000/register").reply(400, {
      message: "Email already exists",
    });

    await userEvent.type(screen.getByPlaceholderText("Username"), "testuser");
    await userEvent.type(screen.getByPlaceholderText("Email"), "existing@example.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "password123");
    await userEvent.type(screen.getByPlaceholderText("Confirm Password"), "password123");
    
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    fireEvent.click(screen.getByText("Registration Now"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});