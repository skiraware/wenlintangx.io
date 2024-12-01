<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-shop</title>
    <link rel="stylesheet" href="./css/detail.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://kit.fontawesome.com/ab6b481ece.js" crossorigin="anonymous"></script>
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
            <span class="Word">visitor</span>
        </div>
    </nav>
    
	<?php
	require __DIR__.'/admin/lib/db.inc.php';

	$pid = (int)$_REQUEST['pid'];
	$product_cat = '';
	$product_detail = '';
        $res = ierg4210_prod_fetchAll();
	$res2 = ierg4210_cat_fetchall();
	foreach ($res as $value){
		if($value["PID"]==$pid){
			$image_path = './admin/lib/images/'.$value['PID'];

                	$filetype = '';
                	foreach (array('jpeg', 'png', 'gif') as $ext) {
                        	if (file_exists($image_path.'.'.$ext)) {
                                	$filetype = $ext;
                                	break;
                    	   	}
                	}
			$cid = $value["CID"];
		        $name = $value["NAME"];
        		$price = $value["PRICE"];
			$desc = $value["DESCRIPTION"];
			$inv = $value["INVENTORY"];
			break;
		}
	}
	foreach ($res2 as $value2) {
		if($value2['CID']==$cid){
			$cat_name = $value2["NAME"];
		} 
	}

	 $product_cat .= '<a href="./main.php?cid='.$cid.'">';
         $product_cat .= ' <span class="nav-element"><i class="fa-solid fa-chair"></i></span>';
         $product_cat .= '<span class="word2">'.$cat_name.'</span>';
         $product_cat .= '</a>';

	?>

    <nav class=" navigation-bar">
        <a href="./main.php"><span class="nav-element" url=""><i class="fa-solid fa-house"></i></span>
            <span class="word2">Home</span>
        </a>
	<span><i class="fa-solid fa-angle-right"></i></span>

	<?php echo $product_cat;?>

        <span><i class="fa-solid fa-angle-right"></i></span>
        <span class="nav-element" url=""><i class="fa-solid fa-cart-shopping"></i></span>
        <span class="word2">Product List</span>
    </nav>

    <div class="items_list_show">
        <div class="cart"></div>
    </div>
    <div class="hide">
        <div id="total" class="cart"></div>
        <div id=items class="item">

            <button>Checkout</button>
        </div>
    </div>
    <script src="./js/shopping_list.js"></script>

    <div class="category">
	<?php
	$cat_list = '<ul>';

	foreach ($res2 as $a){
    		$cat_list .= '<li><a href = "./main.php?cid='.$a["CID"].'"> '.$a["NAME"].'</a></li>';
	}

	$cat_list .= '</ul>';
	echo $cat_list;
	?>
	
    </div>

<?php
	 $status=$inv>0?'In stock':'Sold out';

    echo '
    <div class="product">
        <div class="left">
            <img src="./admin/lib/images/'.$pid.'.'.$filetype.'" alt="the image cannot be displayed">
        </div>
        <div class="middle">
            <h1 class="name">'.$name.'</h1>
            <h2>'.$status.'</h2>
            <h3 class="description">'.$desc.'</h3>
            <h5 class="description">Only '.$inv.' left</h5>
            <h4 class="description">Delivery by Fri, Jul 8
            </h4>
        </div>
        <div class="right">
            <div class="money">
                <h1 class="description">$</h1>
                <h2 class="sp">'.$price.'</h2>
            </div>
        </div>
    </div>';
?>

</body>

</html>
