# UX Design & Interaction Patterns

This document tracks high-fidelity interaction patterns and design decisions made to enhance the vendor app experience.

### [Interaction] Restricted Action Feedback
**Trigger**: User clicks a visually deactivated (disabled) button.
- **Physical**: Trigger an **Error Haptic** vibration (`NotificationFeedbackType.Error`) to signal a blocked flow.
- **Visual (Guidance)**: The "missing requirement" component (e.g., Inventory Check) performs a **horizontal shake animation** (indicating "no") and a **border color pulse** (flashing a high-contrast accent color).
- **Goal**: Guide the user to the mandatory step without using intrusive popups or error modals.

### [Visual] Success States & Branding
- **Color**: Use **Success Green** (#10B981) for final commitment steps (e.g., Item availability check, Confirm Order button).
- **Rationale**: Distinguishes the "Ready to Cook" phase from the rest of the application's gold-branded UI, providing strong psychological reinforcement.

### [Input] Custom Time selection
- **Pattern**: Use a **Stepper (+/-)** interface with large, center-aligned typography for time-sensitive inputs (Preparation Time).
- **Rationale**: Prevents fat-finger errors common in grid layouts and allows for fast, precise adjustments in high-pressure kitchen environments.

### [Component] Premium Flat Design
- **Elevation**: Avoid `elevation` and native shadows.
- **Contrast**: Use **1.5px borders** and vibrant background fills (e.g., solid primary colors during swipes) to create depth and focus.
- **Interaction**: Use [SwipeToConfirm](file:///Users/fudodeoffice/Desktop/fudode-vendor-app/components/ui/SwipeToConfirm.tsx#29-111) for irreversible actions (Accepting an order) with high-contrast color fills for clear progress indicators.
