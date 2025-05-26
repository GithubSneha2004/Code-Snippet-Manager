import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Signup from "../components/Signup";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

jest.mock("../utils/auth", () => ({
  login: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: ADD_USER,
      variables: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      },
    },
    result: {
      data: {
        addUser: {
          token: "fake-jwt-token",
        },
      },
    },
  },
];

describe("Signup Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders signup form inputs", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Signup />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Signup />
      </MockedProvider>
    );

    // Password field and its toggle button
    const passwordInput = screen.getByLabelText(/^password$/i);
    const passwordToggleBtn = screen.getByTestId("password-toggle");

    expect(passwordInput).toHaveAttribute("type", "password");

    // Toggle on
    fireEvent.click(passwordToggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Toggle off
    fireEvent.click(passwordToggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("toggles confirm password visibility", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Signup />
      </MockedProvider>
    );

    // Confirm Password field and its toggle button
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const confirmPasswordToggleBtn = screen.getByTestId("confirm-password-toggle");

    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    // Toggle on
    fireEvent.click(confirmPasswordToggleBtn);
    expect(confirmPasswordInput).toHaveAttribute("type", "text");

    // Toggle off
    fireEvent.click(confirmPasswordToggleBtn);
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  test("submits form and calls Auth.login on successful mutation", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Signup />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(Auth.login).toHaveBeenCalledWith("fake-jwt-token");
    });
  });

  test("shows error alert on mutation error", async () => {
    const errorMocks = [
      {
        request: {
          query: ADD_USER,
          variables: {
            username: "erroruser",
            email: "error@example.com",
            password: "errorpass",
            confirmPassword: "errorpass",
          },
        },
        error: new Error("Failed to add user"),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Signup />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "erroruser" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "error@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "errorpass" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "errorpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to add user");
    });
  });
});
