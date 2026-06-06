<html>  
<head>  
   <meta http-equiv="content-type" content="text/html; charset=utf-8">  
    <title>exec main function</title>  
</head>  
<body>  
<script type="text/javascript">  
    try {  
        top.blackbox = '<?= htmlspecialchars($_REQUEST["blackbox"]) ?>';  
    } catch (e) {          // 你可以在这里记录错误，但不要显示错误信息给用户，以防止泄露敏感信息  
        console.error('An error occurred:', e);  

    }  
</script>  
</body>  
</html>