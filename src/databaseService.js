const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('./src/backend_database.db', (err) => {
    console.log(err ? err.message : "Connected to database!");
});
/**Dummy Data...*/

//database.run(`INSERT OR IGNORE INTO supplier(id, name, address, contact) VALUES (?, ?, ?, ?)`, [1, "Jeff", "123 Happy Street", "Do Not Contact"],
//    function(err) {
//        console.log(err ? err.message : "Added Supplier row ${this.lastID} to dattabase!");
//    });

/**Code goes here!*/

async function ItemExistsById(id) {
    if (isNaN(parseInt(id))) {
        return new Promise((res, rej) => { rej("-> Not A Number!") });
    } else {
        let sql = `SELECT Id id,
                  Name name,
                  Price price,
                  Quantity quantity,
                  SupplierId supplierId
              FROM item
              WHERE Id = (?)
              ORDER BY Id`;

        return runQuery(sql, [id]);
    };
};

async function ItemExistsByName(name) {
    if (!name) {
        return new Promise((res, rej) => { rej("-> Not A String!") });
    } else {
        let sql = `SELECT Id id,
                  Name name,
                  Price price,
                  Quantity quantity,
                  SupplierId supplierId
              FROM item
              WHERE Name = (?)
              ORDER BY Id`;

        return runQuery(sql, [name])
    };
};

async function GetAllItems() {
    let sql = `SELECT Id id,
                Name name,
                Price price,
                Quantity quantity,
                SupplierId supplierId
            FROM item
            ORDER BY Id`;

    return runQuery(sql, [])
}

async function AddItem(item) {
    if (parseInt(item.id) == NaN) {
      return new Promise((res, rej) => { rej("-> Provided Id is not a number.") });
    } else if (parseFloat(item.price) == NaN) {
      return new Promise((res, rej) => { rej("-> Provided Price is not a decimal value.") });
    } else if (parseInt(item.quantity) == NaN) {
      return new Promise((res, rej) => { rej("-> Provided Quantity is not a number.") });
    } else if (parseInt(item.supplierId) == NaN) {
      return new Promise((res, rej) => { rej("-> Provided SupplierId is not a number.") });
    }

    console.log(item.supplierId);

    SupplierExistsById(parseInt(item.supplierId))
      .then((data) => {
        let sql = `INSERT OR IGNORE INTO item(id,
                  name,
                  price,
                  quantity,
                  supplierId)
          VALUES (?, ?, ?, ?, ?)`;

        return runChange(sql, [parseInt(item.id), item.name, parseFloat(item.price), parseInt(item.quantity), parseInt(item.supplierId)]);
      })
      .catch((error) => {
        return new Promise((res, rej) => { rej(`-> Provided SupplierId is not a valid supplier:\n\t${error}`) });
      });
}

async function UpdateQuantity(itemId, quantity) {
    if (isNaN(parseInt(itemId))) {
        return new Promise((res, rej) => { rej("-> Provided Id is not a number.") });
    } else if (isNaN(parseInt(quantity))) {
        return new Promise((res, rej) => { rej("-> Provided quantity is not a number.") });
    }

    let sql = `UPDATE item
          SET quantity = quantity + ${quantity}
          WHERE id=${itemId}`;

    return runChange(sql, []);

}

async function DeleteItem(itemId) {
    let sql = `DELETE FROM item WHERE id=${itemId}`;

    return runChange(sql, [])
}

async function SupplierExistsById(id) {
    console.log(id);
    id = parseInt(id);
    console.log(id);
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
    if (parseInt(supplier.id) == NaN) {
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

module.exports = {
    ItemExistsById,
    ItemExistsByName,
    GetAllItems,
    AddItem,
    UpdateQuantity,
    DeleteItem,
    SupplierExistsById,
    SupplierExistsByName,
    GetAllSuppliers,
    AddSupplier,
    DeleteSupplier
};