<?php
include_once('lib/auth.php');
include_once('lib/csrf.php');
require __DIR__ . '/lib/db.inc.php';
#if(!auth()){
#	var_dump($_SESSION['auth']['state']);
if (!$_SESSION['auth']['state']) {
    //var_dump('adasdadad');
    header('Location:../login.php');
}
?>
<html>
<table>
    <thead>
        <tr>
            <th>Order(from earliest to latest)</th>
            <th>ID</th>
            <th>Status</th>
            <th>Update Time</th>
            <th>Total amount</th>
            <th>Currency</th>
            <th>Items(name price quantity)</th>
        </tr>
    </thead>
    <tbody>
        <?php
        include_once("admin/lib/db.inc.php");
        global $all;
        $all = ierg4210_order_fetchlastest5();
        $cnt = 1;
        foreach ($all as $data) {
            $info = unserialize($data["INFO"]);
            $list = '<tr>';
            $list .= '<td>' . $cnt . '</td>';
            $list .= '<td>' . $info->id . '</td>';
            $list .= '<td>' . $info->Status . '</td>';
            $list .= '<td>' . $info->update_time . '</td>';
            $list .= '<td>' . $info->purchase_units[0]->amount->value . '</td>';
            $list .= '<td>' . $info->purchase_units[0]->amount->currency_code . '</td>';
            $lenght = $info->purchase_units[0]->items;
            $list .= '<td>';
            for ($i = 0; $i < $lenght; $i++) {
                $list .= '<li>' . $info->purchase_units[0]->itmes[$i]->name . ' ' . $info->purchase_units[0]->itmes[$i]->unit_amount->value . ' ' . $info->purchase_units[0]->itmes[$i]->quantity . '</li>';
            }
            $list .= '</td>';
            $list .= '</tr>';
            $cnt++;
            echo $list;
        }
        ?>
    </tbody>
</table>

</html>