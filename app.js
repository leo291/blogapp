//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const usuarios = require("./routes/usuario")
const path = require("path")
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")
//configurações
	//Sessao
	 app.use(session({
	 	secret: "cursodenode",
	 	resave: true,
	 	saveUninitialized: true
	 }))
//	 app.use(passport.initialize())
	 app.use(passport.session()) //muito importante que fique nessa ordem
	 app.use(flash())
	 //Middleware
	 app.use((req,res,next) =>{
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash("error_msg")
	next();
})
	//body PArser
		app.use(bodyParser.urlencoded({extended: true}))
		app.use(bodyParser.json())
	//Handlebars
	app.engine('handlebars', handlebars({defaultlayout: 'main'}))
	app.set('view engine', 'handlebars')
	//mongoose
	
	mongoose.Promise = global.Promise;
	 mongoose.connect(db.mongoURI  ,{
	 useNewUrlParser: true,
	 useUnifiedTopology: true  
}).then(() =>	{
	 	console.log("Mongo conectado com sucesso")
	 }).catch((err) =>{
	 	console.log(err)

	 })
	//Public
		app.use(express.static(path.join(__dirname,"public")))

//rotas

app.get("/",(req,res)=>{
	Postagem.find().lean().populate("categoria").sort({date:"desc"}).then((postagens) =>{
		
		res.render("index", {postagens: postagens})

	}).catch((err)=>{

			req.flash("error_msg", "houve um erro interno" + err)
			req.redirect("/404")
	})
	app.get("/404",(req,res)=>{
		
			res.send("Erro 404!")

		})
		})


	app.get("/postagem/:slug",(req,res) => {
		Postagem.find({slug: req.params.slug}).lean().then((postagem)=>{

			if(postagem){
				res.render("postagem/index",{postagem: postagem})
			}else{
				req.flash("error_msg", "Nenhuma mensagem encontrada")
				res.redirect("/")
			}
		}).catch((err) => {
				req.flash("error_msg", "Nenhuma mensagem encontrada")
				res.redirect("/")
		})

	})

	app.get("/categoria/:_id",(req,res) => {
		Postagem.find({categoria: req.params._id}).lean().then((postagem)=>{
			console.log(postagem)
			if(postagem){
				res.render("postagem/index",{postagem: postagem})
			}else{
				req.flash("error_msg", "Nenhuma mensagem encontrada")
				res.redirect("/")
			}
		}).catch((err) => {
				req.flash("error_msg", "Nenhuma mensagem encontrada")
				res.redirect("/")
		})

	})


app.get("/categorias", (req,res)=>{

		Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
		//console.log(categorias)
		res.render('categorias/index',{categorias:categorias})

			}).catch((erro) => {
		res.flash('error_msg',"houve um erro ao listar categorias")
		res.redirect("/")
	
			})

} )



//chamandos as rotas de admin e usuarios
app.use("/admin",admin)
app.use("/usuarios", usuarios)
//outros

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>{
  console.log("coco");
});
