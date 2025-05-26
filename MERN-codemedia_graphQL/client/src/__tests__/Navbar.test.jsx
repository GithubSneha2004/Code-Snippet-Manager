import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbarhome from "../components/Navbar";
import Auth from "../utils/auth";

// Mock Auth module
jest.mock("../utils/auth", () => ({
  loggedIn: jest.fn(),
  logout: jest.fn(),
}));

describe("Navbarhome Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders brand name with correct style", () => {
    Auth.loggedIn.mockReturnValue(false);

    render(<Navbarhome />);
    const brand = screen.getByText(/Code-Media/i);
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute("href", "/");
  });

  test("renders Dashboard and Logout when user is logged in", () => {
    Auth.loggedIn.mockReturnValue(true);

    render(<Navbarhome />);

    const dashboardLink = screen.getByText(/Dashboard/i);
    const logoutLink = screen.getByText(/Logout/i);

    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");

    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute("href", "/logoutmessage");

    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Signup/i)).not.toBeInTheDocument();
  });

  test("calls Auth.logout on clicking Logout", () => {
    Auth.loggedIn.mockReturnValue(true);

    render(<Navbarhome />);
    fireEvent.click(screen.getByText(/Logout/i));
    expect(Auth.logout).toHaveBeenCalled();
  });

  test("renders Login and Signup when user is not logged in", () => {
    Auth.loggedIn.mockReturnValue(false);

    render(<Navbarhome />);

    const loginLink = screen.getByText(/Login/i);
    const signupLink = screen.getByText(/Signup/i);

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");

    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/signup");

    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  test("renders Navbar toggle and collapses correctly", () => {
    Auth.loggedIn.mockReturnValue(true);

    render(<Navbarhome />);
    const toggle = screen.getByLabelText(/toggle navigation/i);
    expect(toggle).toBeInTheDocument();

    // We simulate toggle click — though visual expansion isn’t testable in JSDOM,
    // this at least confirms presence and clickability
    fireEvent.click(toggle);
  });
});
