 // src/utils/helper.jsx (or helpers.js, depending on what you named it)

export const createCategorySlug = (categoryName) => {
    // This function cleans the category name to create a URL-friendly slug.
    // It replaces spaces with hyphens, converts to lowercase, and removes problematic characters.
    return categoryName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove characters that are not alphanumeric, space, or hyphen
        .replace(/\s+/g, '-')       // Replace one or more spaces with a single hyphen
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
};