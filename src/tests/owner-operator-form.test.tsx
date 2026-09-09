import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OwnerOperatorForm } from "@/components/forms/owner-operator-form";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const submitForm = vi.hoisted(() => vi.fn());
vi.mock("@/lib/forms/submit", () => ({ submitForm }));

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Jordan Blake");
  await user.type(screen.getByLabelText(/email/i), "jordan@example.com");
  await user.type(screen.getByLabelText(/^phone$/i), "9168418948");
}

describe("OwnerOperatorForm", () => {
  beforeEach(() => {
    submitForm.mockReset();
  });

  it("blocks submission when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<OwnerOperatorForm />);

    await user.click(screen.getByRole("button", { name: /submit details/i }));

    expect(await screen.findByText("Enter your full name")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("rejects a phone number that is too short", async () => {
    const user = userEvent.setup();
    render(<OwnerOperatorForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jordan Blake");
    await user.type(screen.getByLabelText(/email/i), "jordan@example.com");
    await user.type(screen.getByLabelText(/^phone$/i), "91684");
    await user.click(screen.getByRole("button", { name: /submit details/i }));

    expect(
      await screen.findByText("Enter a phone number we can reach you on"),
    ).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("shows the confirmation only after the submission is delivered", async () => {
    submitForm.mockResolvedValue({ success: true, message: "ok" });
    const user = userEvent.setup();
    render(<OwnerOperatorForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /submit details/i }));

    expect(await screen.findByText("Application details received.")).toBeInTheDocument();
    expect(submitForm).toHaveBeenCalledWith(
      "owner-operator",
      expect.objectContaining({ fullName: "Jordan Blake" }),
    );
  });

  it("keeps the form visible when delivery fails", async () => {
    submitForm.mockResolvedValue({ success: false, message: "could not send" });
    const user = userEvent.setup();
    render(<OwnerOperatorForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /submit details/i }));

    expect(await screen.findByRole("button", { name: /submit details/i })).toBeInTheDocument();
    expect(screen.queryByText("Application details received.")).not.toBeInTheDocument();
  });
});
