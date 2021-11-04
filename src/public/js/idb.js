let db;
// establish a connection to IndexedDB database called 'budget_hunt' and set it to version 1
const request = indexedDB.open('colin-pwa-budget-tracker', 1);

request.onupgradeneeded = event => {
    let db = event.target.result;

    console.log(event);

    if (!db.objectStoreNames.contains('colin-pwa-budget-tracker')) {
        db.createObjectStore('colin-pwa-budget-tracker', {
            autoIncrement: true
        });
    }
};

request.onsuccess = event => {
    db = event.target.result;
    console.log(db);
    console.log(`Excellent! ${event.type}`);
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = event => console.error(event);

function checkDatabase() {

    let transaction = db.transaction(['colin-pwa-budget-tracker'], "readwrite");

    let store = transaction.objectStore('colin-pwa-budget-tracker');

    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    transaction = db.transaction([pendingObjectStoreName], "readwrite");

                    // access your pending object store
                    store = transaction.objectStore(pendingObjectStoreName);

                    // clear all items in your store
                    store.clear();
                });
        }
    };
}

// save record
function saveRecord(record) {
    const db = request.result;

    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction([pendingObjectStoreName], "readwrite");

    // access your pending object store
    const store = transaction.objectStore(pendingObjectStoreName);

    // add record to your store with add method.
    store.add(record);
}

// listen 
window.addEventListener("online", checkDatabase);