import { render, screen } from "@testing-library/react";
import Exercise1 from "@/app/exercise1/page";
import Exercise2 from "@/app/exercise2/page";

const mockFetch = (body: unknown, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => body });
};

describe("exercise pages", () => {
  it("exercise1 renders the range with the service data", async () => {
    mockFetch({ min: 5, max: 50 });
    render(<Exercise1 />);
    expect(await screen.findByRole("slider", { name: "Maximum" })).toHaveAttribute("aria-valuenow", "50");
    expect(global.fetch).toHaveBeenCalledWith("/api/range");
  });

  it("exercise2 renders the range with the service data", async () => {
    mockFetch({ rangeValues: [1.99, 5.99, 10.99] });
    render(<Exercise2 />);
    expect(await screen.findByTestId("max-label")).toHaveTextContent("10.99 €");
  });

  it("shows loading before the data arrives", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
    render(<Exercise1 />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it.each([
    ["Exercise1", Exercise1],
    ["Exercise2", Exercise2],
  ])("%s shows an error when the service fails", async (_, Page) => {
    mockFetch({}, false);
    render(<Page />);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
