const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
    const saltRounds = 10; // Un estándar muy seguro para la industria
    return await bcrypt.hash(password, saltRounds);
};