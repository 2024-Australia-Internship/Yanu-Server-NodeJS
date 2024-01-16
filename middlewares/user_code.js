const userCodeRequired = async (req, res, next) => {
    const codeLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = '';
    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * codeLetter.length);
        code += codeLetter.charAt(randomIndex);
    }
    req.code = code;
    next();
}

module.exports = userCodeRequired