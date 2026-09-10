import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";

function DeleteRow({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value="7" />
      <ConfirmSubmit recordKind="service" recordName="Flatbed Hauling" />
    </form>
  );
}

describe("ConfirmSubmit", () => {
  it("names the record and posts nothing until the delete is confirmed", async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(<DeleteRow action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveTextContent("Delete this service?");
    expect(dialog).toHaveTextContent("Flatbed Hauling");
    expect(action).not.toHaveBeenCalled();
  });

  it("cancels without submitting", async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(<DeleteRow action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("submits the form with its hidden fields once confirmed", async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(<DeleteRow action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(await screen.findByRole("button", { name: "Delete service" }));

    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0].get("id")).toBe("7");
  });

  it("closes on Escape without submitting", async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(<DeleteRow action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("alertdialog");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });
});
