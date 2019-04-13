var app     =     require("express")();
var mysql   =     require("mysql");
var http    =     require('http').Server(app);
var io      =     require("socket.io")(http);

/* Creating POOL MySQL connection.*/

var pool    =    mysql.createPool({
      host              :   '127.0.0.1',
	port		:	'3306',
      user              :   'root',
      password          :   '!kobjacky103119',
      database          :   'hackUST',
	socketPath	:	'/var/run/mysqld/mysqld.sock'       

});

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});

/*  This is auto initiated event when Client connects to Your Machien.  */

function updateClient(){

}



io.on('connection',function(socket){  
    console.log("A user is connected");

    socket.on('status added',function(status){
      add_status(status,function(res){
        if(res){
            io.emit('refresh feed',status);
        } else {
            io.emit('error');
        }
      });
    });


});

setInterval(() => {
    io.emit('message', {'message': 'hello Forks'});
}, 10000);




var add_status = function (status,callback) {
    pool.getConnection(function(err,connection){
        if (err) {
        console.log(err); 
	callback(false);
          return;
        }
    connection.query("INSERT INTO `status`SET  ?",[{s_text:status}], function(err,rows){
            connection.release();
            if(!err) {
		console.log(err);
              callback(true);
            }
        });
     connection.on('error', function(err) {
              console.log(err);
		callback(false);
              return;
        });
    });
}

setInterval(() => {
    pool.getConnection(function(err,connection){
        if (err) {

        }else{
			connection.query("SELECT * FROM foodOrder WHERE DATE_ADD(createAt, INTERVAL 15 SECOND) >= NOW();", function(err,rows){
				connection.release();
				if(!err) {
					console.log(err);
						io.emit('data',   {
						   'waitingTime': (Math.random() * 10 + 1).toFixed(2);  // returns a random integer from 1 to 10,
						   'totalOrder': Math.floor(Math.random() * 10) + 1;  // returns a random integer from 1 to 10,
						   'totalStaff': Math.floor(Math.random() * 10) + 1;  // returns a random integer from 1 to 10,
						   'deliveyTime': (Math.random() * 10 + 1).toFixed(2); // returns a random integer from 1 to 10,
						 });
				}
			});			
		}

}, 1000);

http.listen(3000,function(){
    console.log("Listening on 3000");
});
