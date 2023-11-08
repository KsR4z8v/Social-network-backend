import models from '../../database/models/index.js';


const deleteAccountController = async(req,res)=>{
    try{

        const id_usuario = req.id_user;
        const {confirm} = req.body;

        if(confirm == false){
            return res.sendStatus(200);
        }else{
            // cambiar el estado de la cuenta a desactivado
           const disabledUser = await models.userModels.updateDataUserById(id_usuario, {state_accountd : 'deactived'});
           if(!disabledUser){
            return res.status(404).json(userNotFound())
           }
            // eliminar todas las publicaciones del usuario
           const postsDeletes = await models.userModels.deleteAllPublicationsById(id_usuario);




           res.status(200).json({message : 'Your account has been deactivated'}); 
        }




    }catch(err){

    }

}

export default deleteAccountController;