import model from './database/models/index.js';
import postModel from './database/models/postModel.js';


// console.log(userModel.userModels.getUser({id_usuario : 6}, ['at1', 'at2']));


// console.log(userModel.postModels.updateDataPostById("1111", {at1 : 'hola', at2:'hello'}))
model.postModels.updateDataPostById('id_post' , {'likes' : 'likes + 1'});