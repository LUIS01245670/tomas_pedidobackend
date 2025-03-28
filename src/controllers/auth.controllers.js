const { creartokenvendedor } = require("../libs/jwt");
const {usuario}=require("../models/user-model")
const {vendedor}=require("../models/vendedor-model")
const {usuarioaliasalmacen}=require("../models/usuarioaliasalmacen")
const jwt=require('jsonwebtoken');
const { almacen } = require("../models/almacen");
class Useraccioneauth{
    constructor(){
       
    }
    async login(req,res){
      //  const {user,documento}=req.body
      const {user,documento}=req.body
       
      
      let usuari=await usuarioaliasalmacen.findAll({
        include:[
          {model:vendedor,
          attributes:['identificacion','codigo'],
         
          required: true 

        }
        ,
          {model:almacen,
          attributes:['almacen'],
          required: true 
        }

      ],
      where: {
        '$vendedor.identificacion$':documento// <-- Aquí va tu filtro
      },
      
    }
   
       );
     
      
      usuari=usuari.map(u=>u.toJSON())
        
          if(usuari.length>0){
            
            
            req.session.usuario = {
               documento:usuari[0]. vendedor.identificacion,
               almacen:usuari[0].almacen.almacen,
               codigo:usuari[0].vendedor.codigo
            };
            req.session.save(err => {
              if (err) {
                console.error("❌ Error al guardar la sesión:", err);
                return res.status(500).json({ error: 'Error guardando sesión' });
              }
            
              console.log("✅ Sesión guardada correctamente");
              res.status(200).json({ atenticado: true ,almacen:usuari[0].almacen.almacen});
            });
 
          }else{
            res.status(404).json({error:"vendedor no existente"})
          }
    }

    verificarauth(req,res){
     
      const {usuario}=req.session
      console.log(usuario)
        console.log(req.session)
      if(usuario){
        res.json({response:true})
      }else{
        res.json({response:false})
      }
      
       
    }

    logout(req,res){
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: 'No se pudo cerrar la sesión' });
        }
        // Opcional: limpiar la cookie de sesión en el cliente
        res.clearCookie('connect.sid');
        res.json({ message: 'Sesión cerrada correctamente' });
      });

    }


  }

   


module.exports={
    usuarioauth:new Useraccioneauth()
}