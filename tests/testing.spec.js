const { test, expect } = require('@playwright/test');

test('Home Page', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/');
    await expect(page).toHaveTitle(/Task Management Dashboard/i);

    // Ensure Task Form is Visible
    await expect(page.locator('text=Add / Edit Task')).toBeVisible();

    // Task Form Elements
    const titleField = page.locator('input[placeholder="Task Title"]');
    const descriptionField = page.locator('textarea[placeholder="Task Description"]');
    const dueDateField = page.locator('input[type="date"]');
    const priorityDropdown = page.locator('#taskPriority');
    const statusDropdown = page.locator('#taskStatus');
    const saveButton = page.locator('#savetask');

    // Fill Task Form
    await titleField.fill('HTML');
    await descriptionField.fill('Have to finish HTML');
    await dueDateField.fill('2025-03-01'); // Ensure a valid date is selected
    await priorityDropdown.selectOption('Medium');
    await statusDropdown.selectOption('To-Do');

    // **🛠 Debugging Logs**
    console.log("Title: ", await titleField.inputValue());
    console.log("Description: ", await descriptionField.inputValue());
    console.log("Due Date: ", await dueDateField.inputValue());
    console.log("Priority: ", await priorityDropdown.inputValue());
    console.log("Status: ", await statusDropdown.inputValue());

    // **🛠 Ensure Button is Enabled Before Clicking**
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // ** FIX: Wait for Task to Appear**
    await page.waitForTimeout(2000); // Temporary delay for debugging

    // ** Locate Task Section**
    const todoSection = page.locator('#todoColumn');
    const inProgressSection = page.locator('#inProgressColumn');
    const completedSection = page.locator('#completedColumn');

    // Get Selected Status After Filling
    let selectedStatus = await statusDropdown.inputValue();

    // **🛠 Debugging Log to Check Status**
    console.log("Selected Status Before Validation: ", selectedStatus);

    if (selectedStatus === 'To-Do') {
        await expect(todoSection.locator("h3:has-text('HTML')")).toBeVisible();
    } else if (selectedStatus === 'In Progress') {
        await expect(inProgressSection.locator("h3:has-text('HTML')")).toBeVisible();
    } else if (selectedStatus === 'Completed') {
        await expect(completedSection.locator("h3:has-text('HTML')")).toBeVisible();
    }

    // **🛠 Log Number of Elements Found**
    console.log("To-Do Count: ", await todoSection.locator("h3:has-text('HTML')").count());
    console.log("In-Progress Count: ", await inProgressSection.locator("h3:has-text('HTML')").count());
    console.log("Completed Count: ", await completedSection.locator("h3:has-text('HTML')").count());
});
