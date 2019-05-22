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
    inquirer.prompt([{
        type: 'input',
        name: 'itemID',
        message: 'Please enter the ID for the new item to restock'
    },
    {
        type: 'input',
        name: 'newStock',
        message: 'What is the new amount avaiable?'
    }    
]).then(function(answer) {
    var sql = `UPDATE products SET stock_quantity ='${answer.newStock}' WHERE item_id = '${answer.itemID}'`;
    connection.query(sql, (err, res) => {
        console.log(sql);
    if (err) throw err;
    console.log("The Item ID:" + answer.itemID + " was succesfuly updated");
    connection.end();
    })
    })
};

newItem = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What new item would you like to add'
        },
        {
        type: 'input',
        name: 'department',
        message: 'Which department would you like to add it in?'
        },
        {
        type: 'input',
        name: 'price',
        message: 'What is the price?'
        },
        {
        type: 'input',
        name: 'stock',
        message: 'How many are avaiable?'
        }
        ]).then(function(result) {
        var sql = `INSERT INTO products (product_name, department_name, price, stock_quantity)
                   VALUES (${result.name}, ${result.department}, ${result.price}, ${result.stock})`;
        console.log(sql);
        connection.query(sql, (err, res) => {
            if (err) throw err;
            console.log("Updated");
            connection.end();
        })
    })

}