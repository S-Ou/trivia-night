# Questions Components

This directory contains the refactored components for the Questions page, previously located in a single large `page.tsx` file.

## Structure

```
src/components/questions/
├── index.ts              # Barrel export file
├── styled.ts             # All styled-components definitions
├── Categories.tsx        # Main categories list with drag-and-drop
├── Questions.tsx         # Questions list within each category
├── Options.tsx          # Options/answers for each question
├── ImageTrigger.tsx     # Image upload/edit dialog component
└── README.md            # This file
```

## Components

### Categories
- Main container component that displays all question categories
- Handles drag-and-drop reordering of categories
- Uses Accordion component for expand/collapse functionality
- Manages category state and updates

### Questions
- Displays questions within a specific category
- Handles drag-and-drop reordering of questions within categories
- Renders individual question items with numbering
- Contains Options and ImageTrigger components

### Options
- Displays answer options for each question
- Handles drag-and-drop reordering of options (for multiple choice)
- Shows correct answer indicators
- Different display for multiple choice vs. open-ended questions

### ImageTrigger
- Modal dialog for adding/editing question images
- Image URL input and preview
- Error handling for invalid image URLs
- Save functionality with loading states

### styled.ts
- Contains all styled-components used across the question components
- Responsive styles for mobile devices
- Drag-and-drop visual feedback styles
- Theme-aware styling using CSS custom properties

## Benefits of Refactoring

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Testing**: Easier to write unit tests for individual components
4. **Code Organization**: Related functionality is grouped together
5. **Performance**: Smaller components enable better React optimizations
6. **Developer Experience**: Easier to navigate and understand the codebase

## Usage

```tsx
import { Categories, ButtonWrapper } from '@/components/questions';

// Use in your page component
<Categories />
```

The main page component (`src/app/[eventId]/questions/page.tsx`) is now much cleaner and focused on its primary responsibility of rendering the page layout and coordinating the question management UI.
