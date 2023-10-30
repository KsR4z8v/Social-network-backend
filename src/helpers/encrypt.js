import bcrypt from 'bcryptjs';

const encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export default encryptPassword;