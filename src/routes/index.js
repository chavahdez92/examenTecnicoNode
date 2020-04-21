const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Hola mundo'))

router.post('/signup', (req, res) => {
    const { email, password } = req.body;

    const newUser = new User({
        email,
        password
    });

    newUser.save(function (err, user) {
        if (err) {
            res.json({
                rc: '99',
                msg: 'Ocurrió un error al intentar registrar el usuario'
            });
        } else {
            const token = jwt.sign({_id: newUser._id}, 'examenKey');
            res.json({
                rc: '00',
                msg: 'El registro del usuario se realizó con éxito',
                result: user,
                token: token
            });
        }

    });
});

router.post('/signin', (req, res) => {

    const { email, password } = req.body;

    User.findOne({email}, function(err, user){
        if(err){
            res.json({
                rc: '99',
                msg: 'Ocurrió un error al logear registrar el usuario'
            });
        }else{
            if(!user){
                res.json({
                    rc: '98',
                    msg: 'El email ingresado no existe en la base de datos'
                });
            }else{
                if(user.password !== password){
                    res.json({
                        rc: '98',
                        msg: 'La contraseña es incorrecta'
                    });
                }else{
                    const token = jwt.sign({_id: user._id}, 'examenKey');
                    res.json({
                        rc: '00',
                        msg: 'El logeo del usuario se realizó con éxito',
                        result: user,
                        token: token
                    });
                }
            }
        }
    })
})

module.exports = router;

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unthorize Request');
    }

    const token = req.headers.authorization.split('')[1]
    if(token === 'null'){
        return res.status(401).send('Unthorize Request');
    }

    const payload = jwt.verify(token, 'examenKey');
    req.userId = payload._id;
    next();
}