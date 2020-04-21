const express = require('express')
const router= express.Router()
const mongoose = require("mongoose")
require ("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")
require("../config/auth")(passport)

router.get("/registro", (req,res)=>{
res.render("usuarios/registro")

})



router.post('/registro', (req,res) => {
	var erros = [];

	if(!req.body.nome  || typeof req.body.nome == undefined || req.body.nome == null){
		erros.push({
			texto: "Nome Invalido"
		})

	}
	if(!req.body.email  || typeof req.body.email == undefined || req.body.email == null){
	erros.push({
		texto: "E-mail Invalido"
		})
	}
	if(!req.body.senha  || typeof req.body.senha == undefined || req.body.senha == null){
	erros.push({
		texto: "Senha Invalida"
		})
	}
	
	if(req.body.senha2  != req.body.senha ){
	erros.push({
		texto: "Senhas Diferente" 
		})
	}

	if(erros.length > 0){
		res.render("./usuarios/registro", {erros: erros})

	}else{

			Usuario.findOne({email: req.body.email}).then((usuario)=>{	
if(usuario){
					req.flash("error_msg", "E-mail ja foi cadastrado")
					res.redirect("/usuarios/registro")
				}else{
				const novoUsuario = new Usuario({
					nome: req.body.nome,
					email: req.body.email,
					senha: req.body.senha
				})

				bcrypt.genSalt(10, (erro,salt)=>{
		bcrypt.hash(novoUsuario.senha, salt, (erro,hash)=>{ 
			if(erro){
				req.flash("error_msg", "Erro:" + erro)
					res.redirect("/usuarios/registro")
				}

				novoUsuario.senha = hash
						}
					)
				
					novoUsuario.save().then(()=>{
						req.flash("success_msg", "Usuario criado com sucesso")
						res.redirect("/")
					}).catch((err)=>{
						req.flash("error_msg", "Erro:" + err)
						res.redirect("/usuarios/registro")
					})

					}
				)


			}


			})

	}

	})
		


router.get("/login",(req,res)=>{
	res.render("usuarios/login")
})



router.post("/login", (req, res, next)=>{
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/usuarios/login",
		failureFlash: true
	})(req,res,next)

})


module.exports  = router