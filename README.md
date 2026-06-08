# Zotero Collection Builder

A Zotero JavaScript script that creates a collection (if it does not already exist) and automatically adds papers whose titles match a predefined list.

## Features

* Creates a collection automatically if it does not exist.
* Searches the Zotero library by paper title.
* Adds all matching items to the target collection.
* Avoids duplicate item IDs.
* Returns a summary of matched papers.

## Requirements

* Zotero 7
* Access to **Tools → Developer → Run JavaScript**

## Usage

1. Open Zotero.
2. Go to **Tools → Developer → Run JavaScript**.
3. Paste the script.
4. Set the desired collection name:

```javascript
const collectionName = "My New Collection";
```

5. Replace the contents of the `titles` array with the paper titles you want to collect:

```javascript
const titles = [
    "Paper Title 1",
    "Paper Title 2",
    "Paper Title 3"
];
```

6. Run the script.

## Output

The script returns:

* Collection name
* Collection ID
* Number of matched items
* Number of matched titles
* List of titles found

Example:

```json
{
    "collection": "Included Papers",
    "collectionID": 28,
    "matchedItems": 47,
    "matchedTitles": 47
}
```

## Notes

* Matching is performed using Zotero's internal search engine.
* Existing collections are reused.
* Items already present in the collection are not duplicated.
* The original library structure remains unchanged.
