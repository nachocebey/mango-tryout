import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Range from "@/components/Range/Range";

const min = () => screen.getByRole("slider", { name: "Minimum" });
const max = () => screen.getByRole("slider", { name: "Maximum" });

function mockTrack() {
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ left: 0, width: 100 } as DOMRect);
}

const drag = (handle: HTMLElement, x: number) => {
  fireEvent.pointerDown(handle, { pointerId: 1 });
  fireEvent.pointerMove(handle, { clientX: x });
  fireEvent.pointerUp(handle);
};

afterEach(() => jest.restoreAllMocks());

describe("<Range /> normal mode", () => {
  it("starts on the full range", () => {
    render(<Range min={1} max={100} />);
    expect(min()).toHaveAttribute("aria-valuenow", "1");
    expect(max()).toHaveAttribute("aria-valuenow", "100");
  });

  it("is a custom control, not an input range", () => {
    const { container } = render(<Range min={1} max={100} />);
    expect(container.querySelector('input[type="range"]')).toBeNull();
  });

  it("drags both handles", () => {
    mockTrack();
    render(<Range min={0} max={100} />);
    drag(min(), 20);
    drag(max(), 80);
    expect(min()).toHaveAttribute("aria-valuenow", "20");
    expect(max()).toHaveAttribute("aria-valuenow", "80");
  });

  it("ignores pointer moves when not pressed", () => {
    mockTrack();
    render(<Range min={0} max={100} />);
    fireEvent.pointerMove(min(), { clientX: 50 });
    expect(min()).toHaveAttribute("aria-valuenow", "0");
  });

  it("never goes beyond the bounds when dragging outside the track", () => {
    mockTrack();
    render(<Range min={10} max={90} />);
    drag(min(), -500);
    drag(max(), 500);
    expect(min()).toHaveAttribute("aria-valuenow", "10");
    expect(max()).toHaveAttribute("aria-valuenow", "90");
  });

  it("does not let the handles cross", () => {
    mockTrack();
    render(<Range min={0} max={100} />);
    drag(max(), 40);
    drag(min(), 90);
    expect(min()).toHaveAttribute("aria-valuenow", "40");
    drag(max(), 10);
    expect(max()).toHaveAttribute("aria-valuenow", "40");
  });

  it("flags dragging while pressed, for the grabbing cursor", () => {
    mockTrack();
    render(<Range min={0} max={100} />);
    fireEvent.pointerDown(min(), { pointerId: 1 });
    expect(min()).toHaveAttribute("data-dragging", "true");
    fireEvent.pointerUp(min());
    expect(min()).toHaveAttribute("data-dragging", "false");
  });

  it("stops following the pointer after release", () => {
    mockTrack();
    render(<Range min={0} max={100} />);
    drag(min(), 20);
    fireEvent.pointerMove(min(), { clientX: 60 });
    expect(min()).toHaveAttribute("aria-valuenow", "20");
  });

  it("puts the last moved handle on top so they can be separated", () => {
    mockTrack();
    render(<Range min={0} max={100} />);
    drag(min(), 100);
    expect(min()).toHaveStyle({ zIndex: "2" });
    expect(max()).toHaveStyle({ zIndex: "1" });
  });

  it("moves with the keyboard", async () => {
    render(<Range min={0} max={100} />);
    min().focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}");
    expect(min()).toHaveAttribute("aria-valuenow", "1");
  });

  it("ignores other keys", async () => {
    render(<Range min={0} max={100} />);
    min().focus();
    await userEvent.keyboard("a{Enter}");
    expect(min()).toHaveAttribute("aria-valuenow", "0");
  });

  describe("editable labels", () => {
    const type = async (name: string, text: string) => {
      const input = screen.getByLabelText(name);
      await userEvent.clear(input);
      if (text) await userEvent.type(input, text);
      await userEvent.keyboard("{Enter}");
      return input;
    };

    it("sets a new min value", async () => {
      render(<Range min={1} max={100} />);
      await type("min value", "30");
      expect(min()).toHaveAttribute("aria-valuenow", "30");
    });

    it("sets a new max value", async () => {
      render(<Range min={1} max={100} />);
      await type("max value", "60");
      expect(max()).toHaveAttribute("aria-valuenow", "60");
    });

    it("clamps values under the minimum and over the maximum", async () => {
      render(<Range min={1} max={100} />);
      await type("min value", "-50");
      expect(min()).toHaveAttribute("aria-valuenow", "1");
      await type("max value", "500");
      expect(max()).toHaveAttribute("aria-valuenow", "100");
    });

    it("does not let the labels cross the other handle", async () => {
      render(<Range min={1} max={100} />);
      await type("max value", "50");
      await type("min value", "80");
      expect(min()).toHaveAttribute("aria-valuenow", "50");
    });

    it("restores the old value when the text is empty", async () => {
      render(<Range min={1} max={100} />);
      const input = await type("min value", "");
      expect(input).toHaveValue(1);
      expect(min()).toHaveAttribute("aria-valuenow", "1");
    });
  });
});

describe("<Range /> fixed values mode", () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  it("shows currency labels that are not editable", () => {
    render(<Range values={values} />);
    expect(screen.getByTestId("min-label")).toHaveTextContent("1.99 €");
    expect(screen.getByTestId("max-label")).toHaveTextContent("70.99 €");
    expect(screen.queryByRole("spinbutton")).toBeNull();
  });

  it("only lands on the given values when dragging", () => {
    mockTrack();
    render(<Range values={values} />);
    drag(min(), 45);
    expect(min()).toHaveAttribute("aria-valuenow", "10.99");
    drag(max(), 70);
    expect(max()).toHaveAttribute("aria-valuenow", "50.99");
  });

  it("does not let the handles cross", () => {
    mockTrack();
    render(<Range values={values} />);
    drag(max(), 40);
    drag(min(), 100);
    expect(min()).toHaveAttribute("aria-valuenow", "10.99");
    expect(screen.getByTestId("min-label")).toHaveTextContent("10.99 €");
  });

  it("steps option by option with the keyboard", async () => {
    render(<Range values={values} />);
    min().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(min()).toHaveAttribute("aria-valuenow", "5.99");
  });
});
