if(process.env.NODE_ENV == "production"){

	module.exports = {mongoURI: "mongodb+srv://leonardo:Bigoleta15@cluster0-5oj7v.mongodb.net/test" }

}
else{

	module.exports = {mongoURI: "mongodb+srv://leonardo:Bigoleta15@cluster0-5oj7v.mongodb.net/test" } 

}
