import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Login  from "../Page/Login";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from "react-router-dom";

// Mock Axios instance
const mockAxios = new MockAdapter(axios);

describe("Login Component", () => {
  beforeEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  test("should trigger API call and successfully log in the user", async () => {
    render(
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Login />
      </BrowserRouter>
    );
    mockAxios.onPost("http://localhost:5000/login").reply(200, {
      message: "User logged in successfully",
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Login Now"));
    });
  });
});
test("Test the login component ", async () => {
  render(
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Login />
    </BrowserRouter>
  );
  const buttonList = await screen.findAllByPlaceholderText("Password");
  expect(buttonList).toHaveLength(1);
});
