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

  test("renders Dashboard and Logout when user is logged in", () => {
    Auth.loggedIn.mockReturnValue(true);

    render(<Navbarhome />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
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

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });
});
