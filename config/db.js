if(process.env.NODE_ENV == "production"){

	module.exports = {mongoURI: "mongodb+srv://leonardo:Bigoleta15@cluster0-5oj7v.mongodb.net/test?retryWrites=true&w=majority" }

}else{

		module.exports = {mongoURI:"mongodb://localhost/blogapp"} 

}