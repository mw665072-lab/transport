import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/contact-form";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const submitForm = vi.hoisted(() => vi.fn());
vi.mock("@/lib/forms/submit", () => ({ submitForm }));

describe("ContactForm", () => {
  beforeEach(() => {
    submitForm.mockReset();
  });

  it("blocks submission and reports errors when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Enter your name")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("rejects a message that is too short", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/message/i), "hi");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Please add a little more detail")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("shows the confirmation only after the submission is delivered", async () => {
    submitForm.mockResolvedValue({ success: true, message: "ok" });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/message/i), "We have a pallet moving to Reno.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Message sent.")).toBeInTheDocument();
    expect(submitForm).toHaveBeenCalledWith(
      "contact",
      expect.objectContaining({ name: "Alex Rivera" }),
    );
  });

  it("keeps the form visible when delivery fails", async () => {
    submitForm.mockResolvedValue({ success: false, message: "could not send" });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.type(screen.getByLabelText(/message/i), "We have a pallet moving to Reno.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("button", { name: /send message/i })).toBeInTheDocument();
    expect(screen.queryByText("Message sent.")).not.toBeInTheDocument();
  });
});
