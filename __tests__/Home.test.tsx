import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from '@testing-library/user-event';
import RootPage from "@/app/page";

const mockGetSearchParams = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

const mockData = {
    count: 60,
    next: "https://swapi.py4e.com/api/people/?search=a&page=2",
    previous: null,
    results: [
        { name: "Luke Skywalker", height: '172', url: "https://swapi.py4e.com/api/people/1/" },
        { name: "Chewbacca", height: '228', url: "https://swapi.py4e.com/api/people/13/" }
    ]
}

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
    useSearchParams: () => ({
        get: mockGetSearchParams,
    })
}));

describe("Home", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();
    })

    it("renders properly with empty results", () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: [] }),
                });
            })
        );

        render(<RootPage />);

        const heading = screen.getByText('What are you searching for?');
        const searchInput = screen.getByRole('textbox');
        const radioButtons = screen.getAllByRole('radio');
        const emptyText = screen.getByText(/There are zero matches/i);

        expect(heading).toBeVisible();
        expect(radioButtons.length).toBe(2);
        expect(radioButtons[0]).toBeChecked();
        expect(emptyText).toBeVisible();
        expect(searchInput).toBeVisible();
        expect(searchInput).toHaveValue('');
    });

    it("renders input with default value if search query is present", () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: [] }),
                });
            })
        );

        mockGetSearchParams.mockReturnValue(() => 'luke');
        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        expect(searchInput).toHaveValue('luke');
    })

    it("changes input placeholder based on category selection", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: [] }),
                });
            })
        );

        render(<RootPage />);

        const [peopleButton, moviesButton] = screen.getAllByRole('radio');
        const searchInput = screen.getByRole('textbox');
        expect(searchInput).toHaveAttribute('placeholder', 'e.g. Chewbacca, Yoda, Boba Fett');
        expect(peopleButton).toBeChecked();
        await userEvent.click(moviesButton);
        expect(searchInput).toHaveAttribute('placeholder', 'e.g. A New Hope, Return of the Jedi');
        expect(peopleButton).not.toBeChecked();
        expect(moviesButton).toBeChecked();
    })

    it("should have disabled search button if input has no value", () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: [] }),
                });
            })
        );

        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: 'SEARCH' });
        expect(searchInput).toHaveValue('');
        expect(searchButton).toBeDisabled();
    })

    it("should enable search button if input has value", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        json: jest.fn().mockResolvedValue({ data: [] }),
                    });
                }, 100);
            })
        );

        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: 'SEARCH' });
        expect(searchInput).toHaveValue('');
        expect(searchButton).toBeDisabled();

        await userEvent.type(searchInput, 'test');

        expect(searchInput).toHaveValue('test');
        expect(searchButton).toBeEnabled();
    })

    it("should show loading state when search button is clicked", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        json: jest.fn().mockResolvedValue({ data: [] }),
                    });
                }, 100);
            })
        );

        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: 'SEARCH' });
        expect(searchInput).toHaveValue('');
        expect(searchButton).toBeDisabled();

        await userEvent.type(searchInput, 'test');

        expect(searchInput).toHaveValue('test');
        expect(searchButton).toBeEnabled();

        await userEvent.click(searchButton);
        expect(searchButton).toHaveTextContent('SEARCHING...');
    });

    it("should show search results after clicking on search button", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: mockData }),
                });
            })
        );

        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: 'SEARCH' });
        const emptyText = screen.getByText(/There are zero matches/i);
        await userEvent.type(searchInput, 'test');
        await userEvent.click(searchButton);
        expect(emptyText).not.toBeVisible();

        await waitFor(() => {
            const firstResult = screen.getByText(mockData.results[0].name);
            const secondResult = screen.getByText(mockData.results[1].name);
            expect(firstResult).toBeVisible();
            expect(secondResult).toBeVisible();
        })
    })

    it("should clear the results when clicking the close icon at the top right corner", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: mockData }),
                });
            })
        );

        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: 'SEARCH' });
        await userEvent.type(searchInput, 'test');
        await userEvent.click(searchButton);

        await waitFor(async () => {
            const firstResult = screen.getByText(mockData.results[0].name);
            const secondResult = screen.getByText(mockData.results[1].name);
            const clearButton = screen.getByTestId('clear-button');
            await userEvent.click(clearButton);
            expect(mockReplace).toHaveBeenCalledWith('/')
            expect(firstResult).not.toBeVisible();
            expect(secondResult).not.toBeVisible();
        })
    })

    it("should navigate to details page when clicking on see details", async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            new Promise((resolve) => {
                resolve({
                    json: jest.fn().mockResolvedValue({ data: mockData }),
                });
            })
        );

        render(<RootPage />);

        const searchInput = screen.getByRole('textbox');
        const searchButton = screen.getByRole('button', { name: 'SEARCH' });
        await userEvent.type(searchInput, 'test');
        await userEvent.click(searchButton);

        await waitFor(async () => {
            const seeDetailsButton = screen.getAllByRole('button', { name: 'SEE DETAILS' })[0];
            await userEvent.click(seeDetailsButton);
            expect(mockPush).toHaveBeenCalledWith('/people/1?search=&option=people&name=Luke Skywalker')
        })
    })
});