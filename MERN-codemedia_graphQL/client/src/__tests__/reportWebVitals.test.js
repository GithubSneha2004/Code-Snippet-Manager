jest.mock('web-vitals');

describe('reportWebVitals', () => {
  it('does nothing if no callback is passed', async () => {
    const reportWebVitals = (await import('../reportWebVitals')).default;
    reportWebVitals();
  });

  it('does nothing if callback is not a function', async () => {
    const reportWebVitals = (await import('../reportWebVitals')).default;
    reportWebVitals('notAFunction');
  });

  // Removed the 'imports web-vitals and calls metric functions with callback' test as requested
});
