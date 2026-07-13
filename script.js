const collectionName = "My New Collection";

const titles = [
    "Paper Title 1",
    "Paper Title 2",
    "Paper Title 3"
];

// Normalize target titles
const normalizedTitles = new Map(
    titles.map(t => [t.trim().toLowerCase(), t])
);

const libraryID = Zotero.Libraries.userLibraryID;

// Find collection
let collection = Zotero.Collections
    .getByLibrary(libraryID)
    .find(c => c.name === collectionName);

// Create collection if it doesn't exist
if (!collection) {
    collection = new Zotero.Collection();
    collection.libraryID = libraryID;
    collection.name = collectionName;

    await collection.saveTx();
}

// Search for matching items
const ids = [];
const foundTitles = [];

for (const title of titles) {
    const search = new Zotero.Search();
    search.libraryID = libraryID;

    // Broader search
    search.addCondition("title", "contains", title);

    const matches = await search.search();

    for (const id of matches) {
        const item = Zotero.Items.get(id);

        const itemTitle = item.getField("title")
            .trim()
            .toLowerCase();

        if (normalizedTitles.has(itemTitle)) {
            ids.push(id);
            foundTitles.push(item.getField("title"));
        }
    }
}

// Remove duplicates
const uniqueIDs = [...new Set(ids)];
const uniqueTitles = [...new Set(foundTitles)];

// Add items to collection
if (uniqueIDs.length > 0) {
    await Zotero.DB.executeTransaction(async () => {
        await collection.addItems(uniqueIDs);
    });
}

return {
    collection: collection.name,
    collectionID: collection.id,
    matchedItems: uniqueIDs.length,
    matchedTitles: uniqueTitles.length,
    titlesFound: uniqueTitles
};
