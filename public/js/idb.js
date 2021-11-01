let db;
// establish a connection to IndexedDB database called 'user_hunt' and set it to version 1
const request = indexedDB.open('colin-pwa-budget-tracker', 1);

request.onupgradeneeded = function (event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_user`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_user', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function (event) {
    // when db is successfully created with its object store 
    db = event.target.result;

    // check if app is online, i
    if (navigator.onLine) {
        
        // uploadUser();
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new user and there's no internet connection
function saveRecord(record) {
    
    const transaction = db.transaction(['new_user'], 'readwrite');

    // access the object store for `new_user`
    const userObjectStore = transaction.objectStore('new_user');

    // add record to your store with add method
    userObjectStore.add(record);
}

function uploadUser() {
    // open a transaction on your db
    const transaction = db.transaction(['new_user'], 'readwrite');

    // access your object store
    const userObjectStore = transaction.objectStore('new_user');

    // get all records from store and set to a variable
    const getAll = userObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_user'], 'readwrite');
                    // access the new_user object store
                    const userObjectStore = transaction.objectStore('new_user');
                    // clear all items in your store
                    userObjectStore.clear();

                    alert('All saved user has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    // listen for app coming back online
    window.addEventListener('online', uploadUser);


}