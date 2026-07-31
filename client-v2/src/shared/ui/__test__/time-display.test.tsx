import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TimeDisplay } from "../time-display";

describe("TimeDisplay", () => {
  it("renders minute, second, and millisecond segments", () => {
    render(<TimeDisplay value="01:23.456" />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
  });

  it("renders a fraction without assuming its precision", () => {
    render(<TimeDisplay value="01:23.45" />);

    expect(screen.getByText("45")).toBeInTheDocument();
  });
});
