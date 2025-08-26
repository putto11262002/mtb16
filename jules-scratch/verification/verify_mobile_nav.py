from playwright.sync_api import Page, expect

def test_mobile_nav_slides_from_top(page: Page):
    """
    This test verifies that the mobile navigation menu slides down from the top.
    """
    # 1. Arrange: Set viewport to a mobile size and go to the homepage.
    page.set_viewport_size({"width": 375, "height": 812}) # iPhone X dimensions
    page.goto("http://localhost:4321")

    # 2. Act: Find the mobile menu button and click it.
    menu_button = page.get_by_role("button", name="เปิดเมนู")
    menu_button.click()

    # Wait for the menu to be fully animated and visible
    sheet_content = page.locator('[data-slot="sheet-content"]')
    expect(sheet_content).to_be_visible()

    # Explicitly wait for a link inside to ensure content is rendered
    news_link = page.get_by_role("link", name="ข่าวสาร")
    expect(news_link).to_be_visible()

    # A final small delay to ensure animations are complete before screenshot
    page.wait_for_timeout(500)

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")
