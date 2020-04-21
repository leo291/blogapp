const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
//model de usuario

require ("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){
console.log(passport)
passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done)=>{
	
			console.log(email, senha, done)
		Usuario.findOne({email: email}).then((usuario) =>{

			if(!usuario){
				return done(null, false, {error_msg: "esta conta nao existe"})
			}
			console.log(usuario + "passou por aqui")
			bcrypt.compare(senha, usuario.senha, (erro,batem)=>{
				if(batem){
						return done(null, usuario)
							console.log(batem + "batem 1 ")
				}else{
						return done(null,false, {error_msg: "senha incorreta"})
				}
						console.log(batem + "batem 2 ")

			})
		console.log(usuario + "passou por aqui 3")
		})

	}))

	passport.serializeUser((usuario, done)=>{
		done(null, usuario.id)
	})


	passport.deserializeUser((id,done)=>{
		User.findById(id, (err,usuario)=>
		{
			done(err, usuario)
		})


	})

}