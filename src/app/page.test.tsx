import RootPage from './page';
import { render, screen } from '@testing-library/react';

describe('Root page', () => {
    it('should render properly', () => {
        render(<RootPage />)
        const text = screen.getByText('What are you searching for?');
        expect(text).toBeVisible();
    })
})