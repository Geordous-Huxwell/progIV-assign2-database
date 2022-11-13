const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const databaseService = require('./databaseService');

//import * as databaseService from './databaseService';

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [
    { title: 'Hello, world!' }
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
});

// defining an endpoint to return all ads
app.get('/', (req, res) => {
    res.send(ads);
});

//ITEM ENDPOINTS
app.get('/api/item/:param?', (req, res) => {
    let parameter = req.params.param;

    databaseService.ItemExistsById(parameter)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.error(error);
            databaseService.ItemExistsByName(parameter)
                .then((data) => {
                    res.send(data);
                })
                .catch((error) => {
                    console.error(error);
                    databaseService.GetAllItems()
                        .then((data) => {
                            res.send(data);
                        })
                        .catch((error) => {
                            console.error("-> Database is empty...");
                            res.status(404).send(["Database is empty..."]);
                        });
                });
        });

});

app.post('/api/item', (req, res) => {
    let item = {
        id: req.body.id,
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        supplierId: req.body.supplierId,
    }

    databaseService.AddItem(item)
        .then((data) => {
            console.log(data);
            res.status(200).send("Item added successfully.");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding Item.");
        });

});

app.put('/api/item', (req, res) => {
    let id = req.body.id;
    let quantity = req.body.quantity;

    databaseService.UpdateQuantity(id, quantity)
        .then((data) => {
            console.log(data);
            res.status(200).send("Item quantity updated successfully.");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error updating item.");
        });

});

app.delete('/api/item/:id', (req, res) => {
    let id = req.body.id;

    databaseService.DeleteItem(id)
        .then((data) => {
            console.log(data);
            res.status(200).send("Item deleted successfully.");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error deleting item.");
        });
});

//SUPPLIER ENDPOINTS
app.get('/api/supplier/:param?', (req, res) => {
    let parameter = req.params.param;
    //console.log(parameter)

    databaseService.SupplierExistsById(parameter)
        .then((data) => {
            //console.log(data);
            res.send(data);
        })
        .catch((error) => {
            console.error(error);
            databaseService.SupplierExistsByName(parameter)
                .then((data) => {
                    //console.log(data);
                    res.send(data);
                })
                .catch((error) => {
                    console.error(error);
                    databaseService.GetAllSuppliers()
                        .then((data) => {
                            //console.log(data);
                            res.send(data);
                        })
                        .catch((error) => {
                            console.error("-> Database is empty...");
                            res.status(404).send(["Database is empty..."]);
                        });
                });
        });
    /*if(databaseService.SupplierExistsByName(parameter)) {
      res.send("DatabaseService.GetSupplierByName(parameter)");
    }
    else {
      res.send("DatabaseService.GetAllSuppliers()");
    } */
});

app.post('/api/supplier', (req, res) => {
    let supplierContact = req.body.contact;

    console.log(req.body);

    if (supplierContact == undefined) supplierContact = "";

    let supplier = {
        id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        contact: supplierContact
    }

    databaseService.AddSupplier(supplier)
        .then((data) => {
            console.log(data);
            res.status(200).send("Supplier added successfully.");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error adding supplier.");
        });
});

app.delete('/api/supplier/:id', (req, res) => {
    let id = req.params.id;

    databaseService.DeleteSupplier(id)
        .then((data) => {
            console.log(data);
            res.status(200).send("Supplier deleted successfully.");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error deleting supplier.");
        });
});