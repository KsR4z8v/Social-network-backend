import services from '../../database/models/index.js'
import responseTemplate from '../../handlersResponses/responseTemplates.js';

const { internalError, userNotFound} = responseTemplate

const avatarUpdate = async (req, resp) => {
try {
        const{id_user} = req.body
        const{avatar_file} = req.files
        
        const url = 'https://example.com/mydatabase'





        const resp_db = await services.usersService.updateAvatarUserByIdUser(id_user, url)

        if(!resp_db){
            return resp.status(404).json(userNotFound())
        }

    return resp.status(200).json({ message: 'OK'})
} catch (error) {
    console.log(error);
    resp.status(500).json(internalError())
    
}

}

export default avatarUpdate