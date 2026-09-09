import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest runs without globals here, so Testing Library's automatic cleanup is not
// registered. Without this, renders accumulate across tests in the same file.
afterEach(cleanup);
