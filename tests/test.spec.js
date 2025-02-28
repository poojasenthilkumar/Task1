/*const {test , expect} = require('@playwright/test');

test('Home Page',async({page})=>{
    await page.goto('http://127.0.0.1:8080/');
    await expect(page).toHaveTitle(/Task Management Dashboard/i) // i - case insensitive

    // checking for dark mode and light mode toggle
    const toggleButton = page.locator('#dark-mode-toggle');
    const toggleText = page.locator('#toggle-text');
    await expect(toggleButton).toBeVisible();
    await expect(toggleText).toHaveText(/Light Mode/i);
    await toggleButton.click();
    await expect(toggleText).toHaveText(/Dark Mode/i);
    await toggleButton.click();
    await expect(toggleText).toHaveText(/Light Mode/i);
    const header = page.locator('text=Add / Edit Task');
    await expect(header).toBeVisible();
    
    //checking for text field and description field 
    const titleField = page.locator('input[placeholder="Task Title"]');
    const descriptionField = page.locator('textarea[placeholder="Task Description"]');
    const titleLabel = page.locator('text=Title');
    await expect(titleLabel).toBeVisible();

    const descriptionLabel = page.locator('text=Description');
    await expect(descriptionLabel).toBeVisible();
    await expect(titleField).toBeVisible();
    await expect(descriptionField).toBeVisible(); 

    //checking whether the fields are empty initially
    await expect(titleField).toBeEmpty();
    await expect(descriptionField).toBeEmpty();

    await titleField.fill('HTML');
    await descriptionField.fill('Have to finish HTML');
    await expect(titleField).toHaveValue('HTML');
    await expect(descriptionField).toHaveValue('Have to finish HTML');

    //checking for Due date label is visible or not 

    const DueDateLabel = page.locator('text=Due Date');
    await expect(DueDateLabel).toBeVisible();

    //checking whether the date has been selected 

    const dueDateField = page.locator('input[type="date"]');
    await expect(dueDateField).not.toHaveValue(''); // if the field is empty - test fails and if the field has value - test passes

    await dueDateField.click(); 

    //Priority Label
    const priorityLabel  = page.locator('text=priority');
    await expect(priorityLabel).toBeVisible();
    //priority field -- select represents that dropdown is select type which we use in HTML. in select tag only we mentions the dropdown list 
    const priorityDropdown = page.locator('#taskPriority');
    await expect(priorityDropdown).toBeVisible();

    //Check whether it has options like Low,Medium and high 
    const options = priorityDropdown.locator('option');
    await expect(options).toHaveText(['Low', 'Medium', 'High']);

    //check whwther the Default value should be set as Low 
    await expect(priorityDropdown).toHaveValue('Low');

    //sample checking whether the option selected is working or not 
    await priorityDropdown.selectOption('Medium'); // In Playwright, selectOption() is used to select an option from a <select> dropdown.
    await expect(priorityDropdown).toHaveValue('Medium');

    //validation checking 
    //dropdown should not be empty 
    await expect(priorityDropdown).not.toHaveValue('');

    //check - the user should able to click and change the priority 
    await expect(priorityDropdown).not.toBeDisabled();

    //Status 
    //status Label
    const statuslabel = page.locator('text=Status');
    await expect(statuslabel).toBeVisible();
    const statusInput = page.locator('#taskStatus');
    await expect(statusInput).toBeVisible();
    const statusDropdown = ['In Progress','Completed','To-Do'] 
    for (const input of statusDropdown){
        await statusInput.selectOption(input);
        await expect(statusInput).toHaveValue(input);
    }

    //save task button 
    //const saveButton = page.locator('#savetask');
    const saveButton = page.locator("#savetask");
    await expect(saveButton).toBeVisible();
    await saveButton.click();


    // Locate the task in the correct status section
    const todoSection = page.locator('#todoColumn');
    const inProgressSection = page.locator('#inProgressColumn');
    const completedSection = page.locator('#completedColumn');

    let selectedStatus = await statusInput.inputValue();

    if (selectedStatus === 'To-Do') {
        await expect(todoSection.locator("h3:has-text('HTML')")).toBeVisible(); // Specific locator fix
        await expect(inProgressSection.locator("h3:has-text('HTML')")).not.toBeVisible();
        await expect(completedSection.locator("h3:has-text('HTML')")).not.toBeVisible();
    } else if (selectedStatus === 'In Progress') {
        await expect(inProgressSection.locator("h3:has-text('HTML')")).toBeVisible();
        await expect(todoSection.locator("h3:has-text('HTML')")).not.toBeVisible();
        await expect(completedSection.locator("h3:has-text('HTML')")).not.toBeVisible();
    } else if (selectedStatus === 'Completed') {
        await expect(completedSection.locator("h3:has-text('HTML')")).toBeVisible();
        await expect(todoSection.locator("h3:has-text('HTML')")).not.toBeVisible();
        await expect(inProgressSection.locator("h3:has-text('HTML')")).not.toBeVisible();
    }
});
*/