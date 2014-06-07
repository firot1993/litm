<?php
    header("Content-Type:text/html;charset=utf-8");
	session_start();
	if(isset($_POST["Login"]) && $_POST["Login"] == "login")
	{
		$user = $_POST["username"];
		$psw = $_POST["password"];
		if($user == "" || $psw == "")
		{
			echo "<script>alert('请输入用户名或密码！'); 
			      history.go(-1);
				  </script>";
		}
		else
		{
			mysql_connect("localhost:","root","");
			mysql_select_db("bookdrifting");
			$sql = "select user,password from users 
			        where user = '$_POST[username]' 
					and password = '$_POST[password]'";
			$result = mysql_query($sql);
			$num = mysql_num_rows($result);
			if($num)
			{
			    $_SESSION['user']=$user;
				echo $_SESSION['user'];
	            echo "<script language='javascript'> 
		        location.replace('index.html') 
			    </script>";
			}
			else
			{
				echo "<script>alert('用户名或密码不正确！');history.go(-1);</script>";
			}
		}
	}
	else
	{
		echo "<script>alert('提交未成功！'); history.go(-1);</script>";
	}
	mysql_close($con);
?>