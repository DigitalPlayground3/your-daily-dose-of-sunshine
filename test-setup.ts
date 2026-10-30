import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement these, so give the tests harmless stand-ins.
window.scrollTo = (() => {}) as typeof window.scrollTo;
