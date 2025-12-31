# Playwright Testing Guidelines for Copilot

## Overview

When writing Playwright tests for this project, prioritize accessibility-focused testing patterns that ensure the application works for all users, including those using assistive technologies.

## Core Principles

### 1. Query Elements by Semantic Meaning, Not Implementation Details

**Prefer:**

- `page.getByRole('button', { name: 'Submit' })`
- `page.getByLabel('Email address')`
- `page.getByText('Welcome back')`
- `page.getByAltText('Profile picture')`

**Avoid:**

- Class selectors: `.submit-btn`
- ID selectors: `#submit-button`
- Data-testid attributes (use only as last resort)
- CSS selectors based on structure

**Why:** Users interact with semantic meaning, not implementation. If semantic queries don't work, it highlights real accessibility issues that need fixing.

### 2. Use Playwright's Built-in Locator Methods

Playwright provides excellent accessibility-focused locators:

```typescript
// By role (preferred for interactive elements)
await page.getByRole('button', { name: 'Sign in' })
await page.getByRole('heading', { name: 'Dashboard', level: 1 })
await page.getByRole('textbox', { name: 'Search' })
await page.getByRole('link', { name: 'Contact us' })

// By label (best for form inputs)
await page.getByLabel('Email address')
await page.getByLabel('Password')

// By placeholder (when label isn't available)
await page.getByPlaceholder('Enter your email')

// By text content (for non-interactive elements)
await page.getByText('Welcome to our site')

// By alt text (for images)
await page.getByAltText('Company logo')
```

### 3. Test Keyboard Navigation

Always test that interactive features work with keyboard-only navigation:

```typescript
test('can navigate menu with keyboard', async ({ page }) => {
  await page.goto('/')

  // Tab to the menu button
  await page.keyboard.press('Tab')
  const menuButton = page.getByRole('button', { name: 'Open menu' })
  await expect(menuButton).toBeFocused()

  // Activate with Enter
  await page.keyboard.press('Enter')

  // Check first menu item is focused
  const firstItem = page.getByRole('menuitem', { name: 'Dashboard' })
  await expect(firstItem).toBeFocused()

  // Navigate with arrow keys
  await page.keyboard.press('ArrowDown')
  const secondItem = page.getByRole('menuitem', { name: 'Profile' })
  await expect(secondItem).toBeFocused()

  // Close with Escape
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).not.toBeVisible()
})
```

**Key keyboard interactions to test:**

- `Tab` / `Shift+Tab` - Navigation between focusable elements
- `Enter` / `Space` - Activation
- `Escape` - Close dialogs/menus
- `ArrowUp` / `ArrowDown` - Navigate lists/menus
- `ArrowLeft` / `ArrowRight` - Navigate tabs/carousels

### 4. Verify Focus Management

Ensure focus moves logically and is always visible:

```typescript
test('focus moves to modal when opened', async ({ page }) => {
  await page.goto('/')

  // Open modal
  await page.getByRole('button', { name: 'Open settings' }).click()

  // Focus should move to modal (or close button within)
  const modal = page.getByRole('dialog', { name: 'Settings' })
  await expect(modal).toBeVisible()

  // First focusable element should receive focus
  const closeButton = modal.getByRole('button', { name: 'Close' })
  await expect(closeButton).toBeFocused()
})
```

### 5. Include Automated Accessibility Scans

Use `@axe-core/playwright` to catch common accessibility violations:

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/')

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})

test('specific component has no violations', async ({ page }) => {
  await page.goto('/dashboard')

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.dashboard-section') // Can target specific areas
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
```

### 6. Test with Different Viewport Sizes

Ensure accessibility at different screen sizes:

```typescript
test('mobile navigation is keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  // Test mobile menu accessibility
  await page.keyboard.press('Tab')
  const menuToggle = page.getByRole('button', { name: 'Menu' })
  await expect(menuToggle).toBeFocused()
})
```

### 7. Verify ARIA Attributes When Necessary

For dynamic content, verify proper ARIA states:

```typescript
test('accordion has correct ARIA states', async ({ page }) => {
  await page.goto('/faq')

  const accordion = page.getByRole('button', { name: 'What is Amber?' })

  // Verify initial state
  await expect(accordion).toHaveAttribute('aria-expanded', 'false')

  // Expand
  await accordion.click()
  await expect(accordion).toHaveAttribute('aria-expanded', 'true')

  // Verify content is visible
  const content = page.getByText('Amber is a role-playing convention')
  await expect(content).toBeVisible()
})
```

### 8. Test Form Validation Accessibility

Ensure error messages are properly announced:

```typescript
test('form errors are accessible', async ({ page }) => {
  await page.goto('/register')

  // Submit empty form
  await page.getByRole('button', { name: 'Submit' }).click()

  // Error should be associated with input
  const emailInput = page.getByLabel('Email address')
  await expect(emailInput).toHaveAttribute('aria-invalid', 'true')

  // Error message should be present and linked
  const errorMessage = page.getByText('Email is required')
  await expect(errorMessage).toBeVisible()

  const errorId = await errorMessage.getAttribute('id')
  await expect(emailInput).toHaveAttribute('aria-describedby', errorId)
})
```

## Test Structure

### Use Descriptive Test Names

```typescript
// Good - describes user action and expected outcome
test('user can navigate to profile page using keyboard', async ({ page }) => {
  // ...
})

// Avoid - too vague
test('profile page works', async ({ page }) => {
  // ...
})
```

### Group Related Accessibility Tests

```typescript
test.describe('Game registration form', () => {
  test('all form fields have labels', async ({ page }) => {
    // ...
  })

  test('form can be completed using keyboard only', async ({ page }) => {
    // ...
  })

  test('error messages are announced to screen readers', async ({ page }) => {
    // ...
  })

  test('has no accessibility violations', async ({ page }) => {
    // ...
  })
})
```

## Common ARIA Roles to Use in Queries

- `button` - Buttons (including icon buttons)
- `link` - Links
- `heading` - Headings (can specify level)
- `textbox` - Text inputs
- `searchbox` - Search inputs
- `combobox` - Select dropdowns with autocomplete
- `listbox` - Select dropdowns
- `option` - Options in select/listbox
- `checkbox` - Checkboxes
- `radio` - Radio buttons
- `tab` - Tab in a tab list
- `tabpanel` - Content panel for a tab
- `dialog` - Modal dialogs
- `alertdialog` - Alert/confirmation dialogs
- `menu` - Menus
- `menuitem` - Items in a menu
- `navigation` - Navigation landmarks
- `main` - Main content landmark
- `banner` - Header/banner landmark
- `contentinfo` - Footer landmark
- `table` - Data tables
- `row` - Table rows
- `cell` - Table cells

## Project-Specific Considerations

### Material-UI Components

Since this project uses @mui, be aware that MUI components generally have good accessibility built-in. Test that:

- Custom wrappers don't break MUI's accessibility
- Props are passed through correctly
- Custom styling doesn't hide focus indicators

### tRPC Integration

When testing forms that submit via tRPC:

- Ensure loading states are accessible
- Verify error states are properly announced
- Test that optimistic updates don't confuse screen readers

### Auth0 Integration

For authentication flows:

- Test keyboard navigation through login process
- Verify error messages are accessible
- Ensure redirect flows maintain proper focus management

## When to Skip Accessibility-First Queries

Only fall back to test IDs or CSS selectors when:

1. Testing implementation details that users don't interact with
2. Testing visual-only elements (decorative images, dividers)
3. As a temporary measure while fixing the underlying accessibility issue (add a TODO comment)

```typescript
// Only when absolutely necessary
await page.locator('[data-testid="internal-component"]')
// TODO: This component needs proper semantic markup
```

## Running Accessibility Tests

For comprehensive coverage:

1. Run standard Playwright tests (with semantic queries)
2. Run axe-core scans on key pages/flows
3. Manually test with keyboard navigation
4. Periodically test with actual screen readers (VoiceOver, NVDA)

## Resources

- [Playwright Locators](https://playwright.dev/docs/locators)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
- [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist)
