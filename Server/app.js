var express = require('express');
var bodyParser=require('body-parser');
var app=express();
var mysql=require('mysql');

app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({    
    extended: false
}));

var connection=mysql.createConnection(
{
	host:'localhost',
	user:'root',
	password:'root',
	database:'sql12225688'

});

connection.connect(function(error)
{
	if(error)
	{
		console.log('Error in connecting to the database');

	}
	else
	{
		console.log('Connected');
	}
});

app.get("/getNotices",function(req,res) {
	
	connection.query("Select n.*,c.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=1  INNER JOIN category c on c.category_id=cm.category_id",function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error");
			res.send("Error in feching data from db");
		}
		else
		{
			console.log("All approved notices are fetched successfully");
			res.send(rows);
		}

	});
});

app.get("/insert",function(req,res) {

	var sql = "INSERT INTO notice(user_id,brief_desc,full_desc,creation_date,updation_date,category_id,img_id,approve) VALUES ()";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error");
		}
		else
		{
			console.log("Inserted Successfully");
		
		}

	});
});

app.get("/update",function(req,res) {

	var sql = "UPDATE user SET user_college = 'Amity' WHERE user_id = 2";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error in updation");
		}
		else
		{
			//console.log("Updated Successfully");
			//res.send(rows);
		}

	});
});


//login(params are email and password)
app.post("/login",function(req,res) {

	
	var sql = "Select * from register where email='"+req.body.email+"' and password='"+req.body.password+"'";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in register table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send("Plaese enter correct data");
			}
			console.log("login Successfully");
			res.send(rows);
		}

	});
});


//register(params are each feild in reg form)
app.post("/register",function(req,res) {
	
	var data=req.body;

	var sql = "Select * from register where email='"+data.email+"'";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error in login");
			throw error;
		}
		else
		{
			if(rows.length>0)
			{
				res.send("Email id already occupied");
			}

			var sql = "INSERT INTO register(user_name,password,category,unique_no,college,img_id,email) VALUES ('"+data.user_name+"','"+data.password+"','"+data.category+"',"+data.unique_id+",'"+data.clg_name+"',"+data.img_id+",'"+data.email+"')";
			  connection.query(sql, function (err, result) {
			    if (err) 
			    	{
			    		console.log("Error in register");
			    		throw err;
			    	}
			    	res.send("Registered Successfully");
			        console.log("1 record inserted");
			  });

		}

	});
});


//get particular user notice(param is only id(ie user id))
app.post("/user_notices",function(req,res) {

	
	var sql = "Select * from notice where user_id='"+req.body.id+"' and approve=1";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send("No notice available by you");
			}
			console.log("User notices successfully fetched");
			res.send(rows);
		}

	});
});

//get notice not approved
app.post("/user_unapprovednotices",function(req,res) {

	
	var sql = "Select * from notice where approve=0";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send("Wuhuu...No notice unapproved..");
			}
			console.log("Admin get unapproved notices");
			res.send(rows);
		}

	});
});

//update unapproved notice to approve(para wil b notice id)
app.post("/approve_notice",function(req,res) {

	
	var sql = "UPDATE notice SET approve = 1 WHERE notice_id = '"+req.body.notice_id+"'";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
		
			console.log(rows.affectedRows+" record updated");
			res.send(rows.affectedRows+" record updated");
		}

	});
});


//delete notice(para wil b notice id)
app.post("/delete",function(req,res) {

	
	var sql = "DELETE FROM notice WHERE notice_id = '"+req.body.notice_id+"'";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
		
			console.log(rows.affectedRows+" record deleted");
			res.send(rows.affectedRows+" record deleted");
		}

	});
});


app.listen(8080,function()
{
	console.log('server started');
});
