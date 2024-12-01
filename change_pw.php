<?php
include_once('admin/lib/csrf.php');
include_once('admin/lib/auth.php');
?>
<html>
<head>
        <meta charset="utf-8" />
        <title>change password page</title>
</head>
<body>
<h1>CHANGE PW</h1>
<fieldset>
        <legend>Change</legend>
        <form id="loginForm" method="POST" action="admin/auth-process.php?action=<?php echo ($action = 'change_pw'); ?>">
                <label for="email">Email: *</label>
                <div>
                <input type="text" name="email" required="required" pattern="^[\w=+\-\/][\w=\'+\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$" />
                </div>
                <label for="old_pw">old Password: *</label>
                <div>
                <input type="password" name="old_pw" required="required" pattern="^[\w@#$%\^\&\*\-]+$" />
		</div>
		<label for="new_pw">new Password: *</label>
                <div>
                <input type="password" name="new_pw" required="required" pattern="^[\w@#$%\^\&\*\-]+$" />
                </div>
		<input type="submit" value="submit" />
		<input type="hidden" name="nonce" value="<?php echo csrf_getNonce('change_pw');
		
		?>"/>
        </form>
</fieldset>

</body>
</html> 
