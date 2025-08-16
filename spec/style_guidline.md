## 2. Visual Style

* **Overall Tone:** Clean, modern, refined—professional yet welcoming, with a touch of a futuristic, approachable vibe.
* **Color Approach:** Light pastel gradients (e.g., soft peach/orange fading to pink), balanced with white and charcoal text. Accent colors are muted but warm, offering subtle contrast.
* **Visual Density:** Spacious, airy layout with plenty of white space around content blocks and UI elements.
* **Use of Gradients & Effects:** Gentle, background-level gradients in hero banners or section panels. Minimal drop shadows or overlays on illustrations—dimension is softly implied, not overt.
* **Consistency Goal:** Uniform use of soft gradient panels, slim sans-serif typography, rounded-corner cards, and coherent iconography—all tying back to a warm, trusted brand feel.

---

## 3. Motion & Interaction

* **Motion Intensity:** Subtle to moderate—smooth and purposeful.
* **Motion Types:** Soft fade-ins for section entrances; hover transitions on buttons and cards; gentle micro-interactions (e.g., icons slightly lifting or color shifts on hover).
* **Interaction Feel:** Calm, responsive, confident—not jittery. Every action feels deliberate and reassuring.
* **Accessibility Rule:** Honor `prefers-reduced-motion`; provide simplified, fade-free transitions when needed.

---

## 4. Asset Usage

* **Images:** Light, illustration-driven. Use recognizable screenshots or UI mockups sprinkled with custom illustrations that show flow or guidance.
* **Video:** Allowed, used sparingly. Should be embedded inline in key sections (e.g., “How it works”) and sized responsively, not as dominating backgrounds.
* **3D/Interactive Media:** Avoid beyond 2D illustrations and simple animated GIFs; focus remains on clarity and approachability.
* **SVGs:** Use both for icons and illustrative accents; ensure scalable visuals without quality loss.
* **Asset Weight Budget:** Lean—optimize vector graphics and compress images. Videos should load lazily.
* **Fallbacks/Variants:** Provide light/dark variants for images or use transparent SVGs. Default to neutral placeholders if assets fail to load.

---

## 5. Typography

* **Hierarchy Emphasis:** Bold, large headlines for hero and section titles; medium-size subheads for feature descriptions; clear body copy.
* **Tone of Copy:** Friendly but polished—marketing-oriented yet grounded in functionality.
* **Special Treatments:** Highlight key phrases in accent color; inline callouts or quotes in italic or soft background pill styles.
* **Overall Impression:** Confident and approachable—headings are quietly attention-grabbing, body text supports clarity.

---

## 6. Feedback & States

* **Loading:** Minimal shimmer on content cards or skeleton placeholders—especially for dynamic sections like video embeds or case-study lists.
* **Empty/Idle:** Use friendly copy ("Nothing here—install the extension to see your first guide!") with simple logos or icons for guidance.
* **Errors & Success:** Inline banners (light peach or orange for success, gentle red for error) that slide in or fade subtly.
* **Transitions:** Sections load with fade or slide; states change without jarring movement.

---

## 7. Dark Mode Consistency

* **Visual Parity:** Dark mode retains sophistication—soft charcoal background, warm accents, minimal glare from gradients.
* **Contrast Strategy:** Maintain high contrast for text; gradient backgrounds become subdued but visible.
* **Asset Adjustments:** Provide alternate image variants or tint overlays; use transparent SVGs that adapt.
* **Gradient & Color Behavior:** Test readability—ensure text atop gradients remains legible in both modes.

---

## 8. Performance Orientation

* **Page Weight Goal:** Moderate but optimized—fast initial load, with lazy-loaded illustrations and deferred videos.
* **Asset Loading:** Hero images and icons load first; heavier media (embedded videos, case study screenshots) load on scroll.
* **Animation Budget:** Keep animations short (200–300ms), simple, and GPU-friendly.
* **Optimization Priority:** Balance clarity and performance—smooth experience without visual compromise.

---

## 9. Inspiration / Direction

* **Reference Moodboards or Designs:** Soft pastel gradient visuals, minimal UI chrome, approachable illustrations intertwined with workflows.
* **Do:**

  * Use light, warm gradients and airy layouts.
  * Emphasize user workflow—show screenshots or diagrams alongside short, benefit-focused copy.
  * Keep motion subtle and purposeful.
* **Don’t:**

  * Overwhelm screens with heavy visuals or loud colors.
  * Use complex 3D or heavy animations.
  * Sacrifice performance for excess ornamentation.

---

## Summary Table

| UI Element             | Approach                                                |
| ---------------------- | ------------------------------------------------------- |
| **Color & Background** | Soft pastel gradient → white background → muted accents |
| **Typography**         | Clear hierarchy, friendly yet professional tone         |
| **Layout**             | Spaced, clean, minimal — focus on clarity               |
| **Visuals**            | Light illustrations + UI screenshots; minimal weight    |
| **Motion**             | Subtle, meaningful, accessible                          |
| **Responsive Design**  | Lean assets, lazy-loading, optimized for user flow      |

