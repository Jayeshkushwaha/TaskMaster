import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'investmentTracker.db',
    location: 'default',
  },
  () => {
    console.log('Database opened');
  },
  error => {
    console.log('ERROR: ' + error);
  }
);

export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)',
      [],
      () => {
        console.log('Users table created successfully');
      },
      error => {
        console.log('Error creating users table ' + error.message);
      }
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS investments (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, name TEXT, amount REAL)',
      [],
      () => {
        console.log('Investments table created successfully');
      },
      error => {
        console.log('Error creating investments table ' + error.message);
      }
    );
  });
};

export const addUser = (email, password, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password],
      (tx, results) => {
        successCallback(results);
      },
      error => {
        errorCallback(error);
      }
    );
  });
};

export const authenticateUser = (email, password, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password],
      (tx, results) => {
        if (results.rows.length > 0) {
          successCallback(results.rows.item(0));
        } else {
          errorCallback('Invalid email or password');
        }
      },
      error => {
        errorCallback(error);
      }
    );
  });
};

export const addInvestment = (userId, name, amount, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO investments (userId, name, amount) VALUES (?, ?, ?)',
      [userId, name, amount],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          successCallback(results);
        } else {
          errorCallback({ message: 'Failed to add investment' });
        }
      },
      error => {
        errorCallback(error);
      }
    );
  });
};

export const getInvestments = (userId, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM investments WHERE userId = ?',
      [userId],
      (tx, results) => {
        const investments = [];
        for (let i = 0; i < results.rows.length; i++) {
          investments.push(results.rows.item(i));
        }
        successCallback(investments);
      },
      error => {
        errorCallback(error);
      }
    );
  });
};

export const deleteInvestment = (investmentId, successCallback, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM investments WHERE id = ?',
      [investmentId],
      (tx, results) => {
        successCallback(results);
      },
      error => {
        errorCallback(error);
      }
    );
  });
};
