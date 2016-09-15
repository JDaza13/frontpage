//DataBase Section

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var ObjectId = require('mongodb').ObjectId;

//Mail sender
var nodemailer = require('nodemailer');

// Connection URL
var url = 'mongodb://user:password@ds021356.mlab.com:21356/mlabdb';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to DB");

  db.close();
});


//Services//
exports.Login = function(req, res) {
  var nickToQuery = req.body.nick;
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var result = fgetUserByNick(nickToQuery,db, function(err,items) {
        if(err){
          res.status(500).jsonp({Msg:"Error al iniciar sesión"});
        }
        else{
          if(items.length>0){
            res.status(200).jsonp({success: items[0]});
          }
          else{
            res.status(200).jsonp({Msg:"No se ha encontrado al usuario"});
          }
          
        }
        db.close();
    });
  });
};

exports.RecoverNick = function (req,res) {
    var mailToCheck = req.body.User.Email;
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'frontpagejs2016@gmail.com', // Your email id
            pass: 'Greedisgood1@' // Your password
        }
    });
    
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var result = fgetUserByMail(mailToCheck,db, function(err,items) {
          if(err){
            res.status(500).jsonp({Msg:"Error al recuper nick"});
          }
          else{
            if(items.length>0){
              transporter.sendMail(mailOptions('frontpagejs2016@gmail.com',mailToCheck,"Recuperación de usuario",items[0].Nick), function(error, info){
                  if(error){
                      console.log(error);
                      res.status(500).jsonp({Msg: "Ha ocurrido un error al enviar el correo"});
                  }else{
                      console.log('Message sent: ' + info.response);
                      res.status(200).jsonp({Msg: "Correo enviado correctamente", status: "success"});
                  };
              });

            }
            else{
              res.status(200).jsonp({Msg:"Correo no registrado", status: "error"});
            }
            
          }
          db.close();
      });
    });    
}

exports.GetAllUsers = function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var result = fgetAllUsers(db, function(err,items) {
        if(err){
          res.status(500).jsonp({Msg:"Error al obtener los usuarios"});
        }
        else{
          res.status(200).jsonp({Users: items});
        }
        db.close();
    });
  });
};

exports.CreateEditUser = function(req, res) {
  
  var user = req.body.User;
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    //Create  
    if(user._id == null){
      var result = fCreateUser(user,db, function(err,params) {
          if(err){
            res.status(500).jsonp({Msg:"Error al crear el usuario"});
          }
          else{
            res.status(200).jsonp({_id: params.insertedId,Msg:"Usuario creado correctamente"});
          }
          db.close();
      });
    }
    //Edit
    else{
      var result = fEditUser(user,db, function(err,params) {
          if(err){
            res.status(500).jsonp({Msg:"Error al editar el usuario los usuarios"});
          }
          else{
            console.log(params);
            res.status(200).jsonp({Msg: params.modifiedCount+" Usuario(s) editado(s) correctamente"});
          }
          db.close();
      });
    }
  });
};

exports.DeleteUser = function(req, res) {
  var userId = req.params.userId;
  
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var result = fDeleteUser(userId,db, function(err,params) {
        if(err){
          res.status(500).jsonp({Msg:"Error al eliminar el usuario", Cause: params});
        }
        else{
          res.status(200).jsonp({Msg: params.deletedCount+" Usuario(s) elminado(s) correctamente"});
        }
        db.close();
    });
  });
};

//Operaciones de MongoDB//

/*Obtener todos los usuarios*/

var fgetAllUsers = function(db, callback) {
  db.collection('users', function(err, collection) {
    assert.equal(null, err);
    collection.find().toArray(function(err,items){
      if(err){
        callback(err);
      }
      else{
        callback(null, items);
      }
    });
  });
};

/*Obtner usuario por nickname*/

var fgetUserByNick = function(nick,db, callback) {
  db.collection('users', function(err, collection) {
    assert.equal(null, err);
    collection.find({ "Nick": nick }).toArray(function(err,items){
      if(err){
        callback(err);
      }
      else{
        callback(null, items);
      }
    });
  });
};

/*Obtner usuario por Email*/

var fgetUserByMail = function(mail,db, callback) {
  db.collection('users', function(err, collection) {
    assert.equal(null, err);
    collection.find({ "Email": mail }).toArray(function(err,items){
      if(err){
        callback(err);
      }
      else{
        callback(null, items);
      }
    });
  });
};

/*Crear un usuario*/

var fCreateUser = function(user, db, callback) {
    db.collection('users').insertOne( user, function(err, result) {
    assert.equal(err, null);
    if(err){
      callback(err);
    }
    else{
      callback(null,result);
    }
  });
};

/*Editar un usuario*/

var fEditUser = function(user, db, callback) {
    var qId = new ObjectId(user._id);
    delete user._id;
    
    db.collection('users').updateOne( { "_id" : qId },{$set: user}, function(err, result) {
    assert.equal(err, null);
    if(err){
      callback(err);
    }
    else{
      callback(null,result);
    }
  });
};

/*Eliminar un usuario*/
var fDeleteUser = function(toDelete, db, callback) {
    if(toDelete.length != 24){
      callback(true,"id Inválido");
    }
    else{
      var qId = new ObjectId(toDelete);
      db.collection('users').deleteOne( { "_id" : qId }, function(err, result) {
        assert.equal(err, null);
        if(err){
          callback(err);
        }
        else{
          callback(null,result);
        }
      });
    }

};

//Obtener opciones de mail
var mailOptions = function(from,to,subject,user){

  var html = "<h3>Su usuario registrado es: </h3><h5>"+user+"</h5><hr><h5>Servicio de recuperación de usuario por frontpage - 2016</h5>";  
  
  var obj = {
    from: from,
    to: to,
    subject: subject,
    html: html
  };
  
  return obj;
}
