<?php 
include_once('admin/lib/csrf.php');
include_once('admin/lib/auth.php');	
?>
<html>
<head>
	<meta charset="utf-8" />
	<title>Login page</title>
</head>
<body>
<h1>LOGIN</h1>
<fieldset>
	<legend>Login</legend>
	<form id="loginForm" method="POST" action="admin/auth-process.php?action=<?php echo ($action = 'login'); ?>">
		<label for="email">Email: *</label>
		<div>
		<input type="text" name="email" required="required" pattern="^[\w=+\-\/][\w=\'+\-\/\.]*@[\w\-]+(\.[\w\-]+)*(\.[\w]{2,6})$" />
		</div>
		<label for="pw">Password: *</label>
		<div>
		<input type="password" name="pw" required="required" pattern="^[\w@#$%\^\&\*\-]+$" />
		</div>
		<input type="submit" value="Login" />
		<input type="hidden" name="nonce" value="<?php echo csrf_getNonce('login');
		//var_dump($_SESSION['csrf_once']);
		?>"/>
	</form>
</fieldset>

</body>
</html>
