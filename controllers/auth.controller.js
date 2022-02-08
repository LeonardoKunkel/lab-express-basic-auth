const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');


exports.register = (req, res) => {
    res.render('auth/register');
}

exports.registerForm = async (req, res) => {
    const {username, password} = req.body;

    if ( !username || !password ) {
        return res.render('auth/register', {
            errorMessage: 'Todos los campos deben llenarse.'
        });
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

	if(!regex.test(password)){

		return res.render("auth/register", {
			errorMessage: "Tu contraseña debe incluir 6 caracteres, al menos un número, una minúscula y una mayúscula."
		})

	}

    const salt  = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        console.log(newUser);
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.render('auth/register', {
                errorMessage: "Por favor utiliza un correo electrónico real."
            })
        }
    }
}

exports.login = (req, res) => {
    res.render('auth/login');
}

exports.loginForm = async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });
    if (!foundUser) {
        res.render('auth/login', {
            errorMessage: 'Email o contraseña incorrecta'
        });
        return
    }

    const verifiedPass = await bcrypt.compareSync(password, foundUser.password);
    if (!verifiedPass) {
        res.render('auth/login', {
            errorMessage: 'Email o contraseña incorrecta'
        })
        return
    }

    req.session.currentUser = {
        _id: foundUser._id,
        username: foundUser.username,
        msg: 'Este es su ticket'
    }

    return res.redirect('/profile');
}
