var express = require('express'),
    createError = require('http-errors'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    logger = require('morgan'),
    sassMiddleware = require('node-sass-middleware'),
    session = require('express-session'),
    passport = require('./config/passaport'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require("connect-flash");


var app = express();


/****************************************************************************************************
 * View Engine
 * 
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/****************************************************************************************************
 * SASS (SCSS)
 * 
 */
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));


/****************************************************************************************************
 * Cookies & log
 * 
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cookieParser("asdf33g4w4hghjkuil8saef345"))

/****************************************************************************************************
 * Session
 * 
 */
app.enable('trust proxy'); // add this line
var FileStore = require('session-file-store')(session);
app.use(session({
    secret: 'asdf33g4w4hghjkuil8saef345',
    store: new FileStore(),
    resave: true,
    saveUninitialized: true,
    key: 'skey.sid',
    proxy: true, // add this line
    cookie: {
        httpOnly: true,
        maxAge: 604800000 //7 days in miliseconds
    }
}));


/****************************************************************************************************
 * PassPort
 * 
 */
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Assim como qualquer middleware, é quintessencial chamarmos next()
// Se o usuário estiver autenticado
var isAuthenticated = function(req, res, next) {
    console.log(JSON.stringify(req.isAuthenticated()));
    if (req.isAuthenticated())
        return next();
    res.redirect('/caraaa');
}

/****************************************************************************************************
 * CORS
 * 
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/****************************************************************************************************
 * Roteamento
 * 
 */

var indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    alunosRouter = require('./routes/ultra-pos/alunos'),
    cursosRouter = require('./routes/ultra-pos/cursos'),
    categoriasRouter = require('./routes/ultra-pos/categorias'),
    cupomRouter = require('./routes/ultra-pos/cupom');

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/alunos', alunosRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/cupom', cupomRouter);

// rotas internas
app.get('/login', function(req, res, next) {
    res.render('login', { title: 'CL Benefí­cios de ' + req.hostname });
});

app.post('/login',
    function(request, response, next) {
        console.log(request.session)
        passport.authenticate('local',
            function(err, user, info) {
                if (!user) { response.send(info.message); } else {

                    request.login(user, function(error) {
                        if (error) return next(error);
                        console.log("Request Login supossedly successful.");
                        return response.send('Login successful');
                    });
                    //response.send('Login successful');
                }

            })(request, response, next);
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function(err) {
        //res.redirect('/'); //Inside a callback… bulletproof!
        res.write("Fechou buteco!!!");
        res.end();
    });
    res.end();
});

app.get('/teste', isAuthenticated, function(req, res) {
    console.log(JSON.stringify(req.isAuthenticated()));
    if (req.isAuthenticated()) {
        res.write("Está!!!")
    } else {
        res.write("NÃO Está!!!")
    }
    res.end();
});



/****************************************************************************************************
 * Pasta de arquivos estáticos
 * Nota: comentado foi migrado para os arquivos de start bin/www-admin e bin/www-inscricao
 */
// app.use(express.static(path.join(__dirname, 'spa')));
app.use(express.static(path.join(__dirname, 'inscricao')));
//app.express_static_fn = express.static; //(path.join(__dirname, 'spa'));
// app.static_config_ultra_inscricao = express.static(path.join(__dirname, 'inscricao'));
// app.use(express.static(path.join(__dirname, 'public')));


/****************************************************************************************************
 * Middleware de erros
 * 
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/****************************************************************************************************
 * Export
 * 
 */
module.exports = app;