import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegiStration from "../Page/Registration";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from "react-router-dom";

const mockAxios = new MockAdapter(axios);

describe("Registration Component", () => {
  beforeEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  test("should trigger API call and successfully register the user", async () => {
    render(
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <RegiStration />
      </BrowserRouter>
    );

    mockAxios.onPost("http://localhost:5000/register").reply(200, {
      message: "User registered successfully",
    });

    fireEvent.click(screen.getByText("Registration Now"));
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
      <RegiStration />
    </BrowserRouter>
  );
  const buttonList = await screen.findAllByRole("button");
  expect(buttonList).toHaveLength(1);
});
