const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/', (req,res) => {

res.render("admin/index")

})
router.get('/posts', (req,res) => {

res.send("Pagina de posts")

})

router.get('/categorias', (req,res) => {
	

	Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
		//console.log(categorias)
		res.render('admin/categorias',{categorias:categorias})

			}).catch((erro) => {
		res.flash('error_msg',"houve um erro ao listar categorias")
		res.redirect("/admin")
	
			})
		})

router.post('/categorias/nova', (req,res) => {
	var erros = [];
	if(!req.body.nome  || typeof req.body.nome == undefined || req.body.nome == null){
		erros.push({
			texto: "Nome Invalido"
		})
	}	
	if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
		erros.push({
			texto: "Slug invalido"
		})
	}	

	if(req.body.nome.length < 2){
		erros.push({
			texto: "Nomes da categorias devem conter mais de 2 caracteres"
		})
	}
	if(erros.length > 0){
		res.render("./admin/addcategorias", {erros: erros})

	}else{
	const novaCategoria = {
		nome: req.body.nome,
		slug: req.body.slug
	}
	new Categoria(novaCategoria).save().then(() => 
	{
		req.flash("success_msg", "Categoria criada com sucesso")
		res.redirect("/admin/categorias")
	}).catch((err) => {
		req.flash("error_msg", "houve um erro ao salvar categoria tente novamente")
		res.redirect("/admin")
	})

	}
		
})

	router.get("/categorias/edit/:id", (req,res) =>{
			Categoria.find({_id:req.params.id}).lean().then((categoria) =>{
			
					res.render("admin/editcategorias",{categoria:categoria})

			}).catch((erro) =>{
				req.flash("error_msg", "Categoria não encontrada")
				res.redirect("/admin/categorias")
			})
		
	})




router.post(
	"/categorias/edit",(req,res)=>{
		Categoria.findOne({_id: req.body.id}).then((categoria) =>{
			categoria.nome = req.body.nome
			categoria.slug = req.body.slug
			
			categoria.save().then(()=>{
				req.flash("success_msg", "Categoria alterada")
					res.redirect("/admin/categorias")
			}).catch((err)=>{
			req.flash("error_msg", "Houve um erro ao editar a acategoria")
			res.redirect("/admin/categorias")})
		}).catch((err)=>{
			req.flash("error_msg", "Houve um erro ao editar a acategoria")
			res.redirect("/admin/categorias")
		})
	})

//CRIAR AS MIDDLEWARE DAQUI


router.post("/categorias/delete",(req,res)=>{

	Categoria.deleteOne({_id: req.body.id}).then(()=>{
		req.flash("success_msg", "Categoria removida")
		res.redirect("/admin/categorias")
	}

		).catch((err)=>{
		req.flash("error_msg", "houve um erro")
		res.redirect("/admin/categorias")
	

})
	})
	
router.get('/categorias/add', (req,res) => {

res.render("admin/addcategorias")
})

router.get("/postagens",(req,res)=>{
		Postagem.find().lean().populate("categoria").sort({date:"desc"}).then((postagens) =>{
			
			res.render("admin/postagens", {postagens: postagens})

		}).catch((err)=>{

				req.flash("error_msg", "houver um erro" + err)
				req.redirect("/admin")
		})



})
router.get("/postagens/add",(req,res)=>{
	Categoria.find().lean().then((categorias)=>{
		res.render("admin/addpostagens", {categorias: categorias})


	}).catch((err) =>{
		req.flash("error_msg", "houve um erro" + err)
		res.redirect('admin/postagens')
	})

		
})

router.post("/postagens/nova",(req,res) => {

	var erros = []

		if(req.body.categoria == "0"){
			erros.push({
				texto: "Selecione uma categoria"
			})

		}
		if(erros.length > 0){
			res.render("admin/addpostagens", {erros: erros})
		}else{
		const novaPostagem = {
			titulo: req.body.titulo,
			descricao: req.body.descricao,
			conteudo: req.body.conteudo,
			categoria: req.body.categoria,
			slug: req.body.slug
		}

		new Postagem(novaPostagem).save().then(()=>{
			req.flash("success_msg", "Postagem criada com sucesso")
			res.redirect("/admin/postagens")

		}).catch((err) =>{

			req.flash("error_msg",  "houve um erro" + err)
			res.redirect("/admin/postagens")

		})

		}

})

router.get("/postagens/edit/:id",(req,res)=>{

	Postagem.find({_id: req.params.id}).populate("categoria").lean().then((postagens)=>{
		Categoria.find().lean().then((categorias)=>{
			//console.log(categorias)
			res.render("admin/editpostagens",{categorias: categorias, postagens:postagens})
		}).catch((err) =>{
			req.flash("error_msg",  "houve um erro" + err)
			res.redirect("/admin/postagens")
		})
	}).catch((err) =>{
			req.flash("error_msg",  "houve um erro" + err)
			res.redirect("/admin/postagens")
		})
})


router.post("/postagens/edit",(req,res)=>{
	Postagem.findOne({_id: req.body.id}).then((postagem)=>{
		postagem.titulo = req.body.titulo
		postagem.slug = req.body.slug
		postagem.descricao = req.body.descricao
		postagem.conteudo = req.body.conteudo
		postagem.categoria = req.body.categoria

		postagem.save().then(()=>{
			req.flash("success_msg", "Postagem editada com sucesso")
			res.redirect("/admin/postagens")

		})
	}).catch((err)=>{
			req.flash("error_msg",  "houve um erro" + err)
			res.redirect("/admin/postagens")
	})

})

router.get(("/postagens/delete/:id"),(req,res)=>{
	Postagem.remove({_id: req.params.id}).then(()=>{
			req.flash("success_msg", "Postagem deleteda com sucesso")
			res.redirect("/admin/postagens")

		}).catch((err)=>{
			req.flash("error_msg",  "houve um erro ao deletar" + err)
			res.redirect("/admin/postagens")
	})

})
module.exports = router