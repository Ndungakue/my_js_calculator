describe('Age Calculator', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="container">
                <div class="calculator">
                    <input type="date" id="date">
                    <p id="result"></p>
                </div>
            </div>
        `;
    });

    test('getDaysInMonth returns correct days for different months', () => {
        // Test February in a non-leap year
        expect(getDaysInMonth(2023, 2)).toBe(28);
        
        // Test February in a leap year
        expect(getDaysInMonth(2024, 2)).toBe(29);
        
        // Test months with 31 days
        expect(getDaysInMonth(2023, 1)).toBe(31);
        expect(getDaysInMonth(2023, 3)).toBe(31);
        
        // Test months with 30 days
        expect(getDaysInMonth(2023, 4)).toBe(30);
        expect(getDaysInMonth(2023, 6)).toBe(30);
    });

    test('calculateAge returns correct age for a given birth date', () => {
        // Mock the current date
        const mockDate = new Date('2024-03-15');
        global.Date = jest.fn(() => mockDate);

        // Set up the test
        const userInput = document.getElementById('date');
        const result = document.getElementById('result');
        
        // Test case 1: Exactly 25 years old
        userInput.value = '1999-03-15';
        calculateAge();
        expect(result.innerHTML).toContain('25 years');
        expect(result.innerHTML).toContain('0 months');
        expect(result.innerHTML).toContain('0 days');

        // Test case 2: 24 years, 11 months, and 15 days
        userInput.value = '1999-04-01';
        calculateAge();
        expect(result.innerHTML).toContain('24 years');
        expect(result.innerHTML).toContain('11 months');
        expect(result.innerHTML).toContain('14 days');
    });
}); 