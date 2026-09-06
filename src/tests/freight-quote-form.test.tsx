import React from "react";
import { describe, expect, it, vi } from "vitest"; import { render, screen } from "@testing-library/react"; import userEvent from "@testing-library/user-event"; import { FreightQuoteForm } from "@/components/forms/freight-quote-form";
vi.mock("sonner",()=>({toast:{success:vi.fn(),error:vi.fn()}}));
describe("FreightQuoteForm",()=>{it("renders and blocks invalid step progression",async()=>{const user=userEvent.setup();render(<FreightQuoteForm/>);expect(screen.getByText("1. Shipment")).toBeInTheDocument();await user.click(screen.getByRole("button",{name:/next/i}));expect(await screen.findByText("Enter the pickup city")).toBeInTheDocument();});});
