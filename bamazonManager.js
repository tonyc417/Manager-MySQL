var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected as ID: ' + connection.threadId);
    runSearch();
})

runSearch = () => {
    inquirer.prompt({
    name: 'theme',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
    ]
}).then(function(choices) {
    switch(choices.theme) {
        case "View Products for Sale":
        checkInventory();
        break;

        case 'View Low Inventory':
        lowStock();
        break;

        case 'Add to Inventory':
        addMore();
        break;

        case 'Add New Product':
        newItem();
        break;

    }
    connection.end();
})};

checkInventory = () => {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " " + res[i].product_name + "\t" + 
            res[i].department_name + "\t" + 
            res[i].price + "\t" + 
            res[i].stock_quantity);
        }
    }); 
}

lowStock = () => {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("Items that need to be restocked: " + res[i].product_name);
            }
        }
    }); 
}

addMore = () => {
    connect.query('INSERT INTO products', (err, res) => {

    })
}

newItem = () => {

}