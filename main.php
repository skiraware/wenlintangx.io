<?php
require __DIR__ . '/admin/lib/db.inc.php';
$res = ierg4210_cat_fetchall();

$products = '<ul>';

foreach ($res as $value) {
    $products .= '<li><a href = "?cid=' . $value["CID"] . '"> ' . $value["NAME"] . '</a></li>';
}

$products .= '</ul>';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E_shop</title>
    <link rel="stylesheet" href="./css/main.css">
    <script src="https://kit.fontawesome.com/ab6b481ece.js" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script
        src="https://www.paypal.com/sdk/js?currency=HKD&client-id=<?php echo json_decode(file_get_contents("payment/secret.json"))->client_id; ?>"></script>
    <script src="payment/cart.js"></script>
</head>

<body>
    <nav class="top-nav">
        <div class="left-nav">
            <span><i class="fa-solid fa-bars"></i></span>
        </div>
        <div class="right-nav">
            <span class="Word">English</span>
            <span><i class="fa-regular fa-moon"></i></span>
            <span><i class="fa-solid fa-magnifying-glass"></i></span>
            <span><i class="fa-solid fa-cart-shopping"></i></span>

            <?php
            require_once('admin/lib/auth.php');

            $user = auth();
            if ($user) {
                echo '<span class="Word">' . $user . '</span>';
                echo '<a href="./admin/auth-process.php?action=logout"><span class="Word">Logout</span></a>';
            } else {
                echo '<span class="Word">Visitor</span>';
                echo '<a href="./login.php"><span class="Word">Login</span></a>';
            }
            ?>
            <a href='/change_pw.php'><span class="Word">Change pw</span></a>
            <a href='/change_pw.php'><span class="Word">Order record</span></a>
        </div>
    </nav>

    <nav class=" navigation-bar">
        <a href="./main.php">
            <span class="nav-element" url=""><i class="fa-solid fa-house"></i></span>
            <span class="word2">Home</span>
        </a>
    </nav>

    <div class="items_list_show">
        <div class="cart"></div>
    </div>
    <div class="hide">
        <div id="total" class="cart"></div>
        <div id=items class="item">
        </div>
        <div id="paypal-button-container"></div>
    </div>
    <script src="./js/shopping_list.js"></script>

    <div class="category">
        <?php
        echo $products;
        ?>
    </div>

    <div class="product_container">
        <?php
        $cid = isset($_REQUEST['cid']) ? (int) $_REQUEST['cid'] : null;
        #echo $cid;
        $product_list = '';
        $res = ierg4210_prod_fetchAll();

        // Generate HTML for each product
        foreach ($res as $value) {

            if ($cid === NULL || $cid == $value['CID']) {
                $products_list .= '<div class="product">';
                $products_list .= '<a href="./detail.php?pid=' . $value["PID"] . '">';
                $products_list .= '<img src="./admin/lib/images/' . $value["PID"] . '.' . $value["FILENAME"] . '" alt="image not found">';
                $products_list .= '<span class="name">' . $value['NAME'] . ":$" . $value['PRICE'] . '</span>';
                $products_list .= '<span class="description">' . $value['DESCRIPTION'] . '</span>';
                $products_list .= '</a>';
                $products_list .= '<button onclick="addtocart(' . $value['PID'] . ')">Add</button>';
                $products_list .= '</div>';
            }
        }

        echo $products_list;
        ?>
    </div>
    <script>

        window.onload = function () {
            var buffer = 400;
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - buffer) {
                init_scroll();
            }
        };
        window.onscroll = function () {
            init_scroll();
        };

        function init_scroll() {
            //console.log(window.innerHeight);
            //console.log(window.scrollY);
            //console.log(document.documentElement.scrollHeight);
            var buffer = 400;
            let params = (new URL(document.location)).searchParams;
            let cid = params.get('cid');
            var currentProducts = []; // Array to hold current products being displayed
            var productList = document.getElementsByClassName('product_container')[0]; // Element to hold product list
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - buffer) {
                $.ajax({
                    url: "/admin/admin-process.php?action=prod_fetchAll",
                    dataType: 'text',
                    type: 'GET',
                    success: function (output) {
                        // Parse returned data
                        output = JSON.parse(output);
                        // Append new products to product list
                        output.success.forEach(function (product) {
                            if (cid == null || product.CID == cid) {
                                var productEl = document.createElement('div');
                                productEl.className = 'product';
                                productEl.innerHTML = '<a href="./detail.php?pid=' + product.PID + '">' +
                                    '<img src="./admin/lib/images/' + product.PID + '.' + product.FILENAME + '" alt="image not found">' +
                                    '<span class="name">' + product.NAME + ':$' + product.PRICE + '</span>' +
                                    '<span class="description">' + product.DESCRIPTION + '</span>' +
                                    '</a>' +
                                    '<button onclick="addtocart(' + product.PID + ')">Add</button>';
                                // Add product element to product list
                                productList.appendChild(productEl);
                                // Add product to current products array
                                currentProducts.push(product);
                            }
                        });
                        // Increment current page counter
                    }
                });
            }
        }

        paypal.Buttons({
            /* Sets up the transaction when a payment button is clicked */
            createOrder: async (data, actions) => {
                /* [TODO] create an order from localStorage */
                let order_details = await fetch("payment/create_order.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(getCartItems(), null, 2)
                }).then(response => response.json());

                console.log(order_details);

                return actions.order.create(order_details);
            },

            /* Finalize the transaction after payer approval */
            onApprove: async (data, actions) => {
                return actions.order.capture()
                    .then(async orderData => {
                        //Successful capture! For dev/demo purposes: 
                        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

                        await fetch('payment/save_order.php', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(orderData, null, 2)
                        });

                        clearCart(); // Clear the web shop cart
                        window.location.href = "main.php"; // Redirect to another page
                    });
            },
        }).render('#paypal-button-container');	
    </script>
</body>

</html>