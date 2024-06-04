// database.js
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log("ERROR: " + error);
  }
);

export const createTable = () => {
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS Items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`,
      [],
      (sqlTxn, res) => {
        console.log("Table created successfully");
      },
      error => {
        console.log("Error on creating table " + error.message);
      }
    );
  });
};

export const getItems = (setItems) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM Items`,
      [],
      (sqlTxn, res) => {
        console.log("Items retrieved successfully");
        let len = res.rows.length;

        if (len > 0) {
          let results = [];
          for (let i = 0; i < len; i++) {
            let item = res.rows.item(i);
            results.push({ id: item.id, name: item.name });
          }
          setItems(results);
        } else {
          setItems([]);
        }
      },
      error => {
        console.log("Error on retrieving items " + error.message);
      }
    );
  });
};

export const addItem = (name, getItems) => {
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO Items (name) VALUES (?)`,
      [name],
      (sqlTxn, res) => {
        console.log(`${name} item added successfully`);
        getItems();
      },
      error => {
        console.log("Error on adding item " + error.message);
      }
    );
  });
};

export const deleteItem = (id, getItems) => {
  db.transaction(txn => {
    txn.executeSql(
      `DELETE FROM Items WHERE id = ?`,
      [id],
      (sqlTxn, res) => {
        console.log(`Item with id ${id} deleted successfully`);
        getItems();
      },
      error => {
        console.log("Error on deleting item " + error.message);
      }
    );
  });
};

export const updateItem = (id, newName, getItems) => {
  db.transaction(txn => {
    txn.executeSql(
      `UPDATE Items SET name = ? WHERE id = ?`,
      [newName, id],
      (sqlTxn, res) => {
        console.log(`Item with id ${id} updated successfully`);
        getItems();
      },
      error => {
        console.log("Error on updating item " + error.message);
      }
    );
  });
};
