const collectionName = "My New Collection";

const titles = [ "Paper Title 1", "Paper Title 2", "Paper Title 3" ];

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

    search.addCondition("title", "is", title);

    const matches = await search.search();

    if (matches.length > 0) {
        ids.push(...matches);
        foundTitles.push(title);
    }
}

// Remove duplicates
const uniqueIDs = [...new Set(ids)];

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
    matchedTitles: foundTitles.length,
    titlesFound: foundTitles
};
