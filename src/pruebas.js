import userModel from './database/models/index.js';


// console.log(userModel.userModels.getUser({id_usuario : 6}, ['at1', 'at2']));


console.log(userModel.postModels.updateDataPostById("1111", {at1 : 'hola', at2:'hello'}))