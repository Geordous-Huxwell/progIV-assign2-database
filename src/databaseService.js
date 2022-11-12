const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('./src/backend_database.db', (err) => {
  console.log(err ? err.message : "Connected to database!");
});
/**Dummy Data...*/

database.run(`INSERT OR IGNORE INTO supplier(id, name, address, contact) VALUES (?, ?, ?, ?)`, [1, "Jeff", "123 Happy Street", "Do Not Contact"], function(err) {
  console.log(err ? err.message : "Added Supplier row ${this.lastID} to dattabase!");
});

/**Code goes here!*/


async function SupplierExistsById(id) {
  if (isNaN(id)) {
    return new Promise((res, rej) => { rej("-> Not A Number!") });
  } else {
    let sql = `SELECT Id id,
                  Name name,
                  Address address,
                  Contact contact
              FROM supplier
              WHERE Id = (?)
              ORDER BY Id`;

    return runQuery(sql, [id])
  };
};

async function SupplierExistsByName(name) {
  if (!name) {
    return new Promise((res, rej) => { rej("-> Not A String!") });
  } else {
    let sql = `SELECT Id id,
                  Name name,
                  Address address,
                  Contact contact
              FROM supplier
              WHERE Name = (?)
              ORDER BY Id`;

    return runQuery(sql, [name])
  };
};

async function GetAllSuppliers() {
  let sql = `SELECT Id id,
                Name name,
                Address address,
                Contact contact
            FROM supplier
            ORDER BY Id`;

  return runQuery(sql, [])
}

async function AddSupplier(supplier) {
  if(parseInt(supplier.id) == NaN) {
    return new Promise((res, rej) => { rej("-> Provided Id is not a number.") });
  }
  let sql = `INSERT OR IGNORE INTO supplier(id,
                      name,
                      address,
                      contact)
              VALUES (?, ?, ?, ?)`;

  return runChange(sql, [parseInt(supplier.id), supplier.name, supplier.address, supplier.contact])
}

async function DeleteSupplier(supplierId) {
  let sql = `DELETE FROM supplier WHERE id=${supplierId}`;

  return runChange(sql, [])
}

async function runQuery(sql, input) {
  return new Promise((res, rej) => {
    database.all(sql, input, (err, rows) => {
      if (err) {
        //console.log(err);
        rej(err);
      }
      if (rows.length == 0) {
        msg = "-> 0 rows found!"
        //console.log(msg);
        rej(msg);
      }
      console.log(rows);
      res(rows);
    });
  });
};

async function runChange(sql, input) {
  return new Promise((res, rej) => {
    database.run(sql, input, function(err) {
      if (err) {
        rej(err);
      }
      res("Database updated!");
    });
  });
}


//database.run(`DELETE FROM supplier WHERE id = 1`, [], function(err) {
//    console.log(err ? err.message : "Removed temp Supplier!");
//});


/**Code stops here!*/
//database.close((err) => {
//    console.log(err ? err.message : "Closed database!");
//});

module.exports = { SupplierExistsById, SupplierExistsByName, GetAllSuppliers, AddSupplier, DeleteSupplier }