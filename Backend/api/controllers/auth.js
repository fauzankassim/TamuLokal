const { getUser, signinWithEmail, signupWithEmail, signup, signin, signout } = require('../services/auth')

const SignupWithEmail = async (req, res) => {
    try {
        const data = req.body;
        const user = await signupWithEmail(data);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error)
    }
}

const SigninWithEmail = async (req, res) => {
    try {
        const data = req.body;
        const user = await signinWithEmail(data);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error)
    }
}

const GetUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        const user = await getUser(token);
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

const Signup = async (req, res) => {
    try {
        const user = await signup();

        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const Signin = async (req, res) => {
    try {
        const user = await signin();

        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

const Signout = async (req, res) => {
    try {
        const user = await signout();

        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).send(err)
    }

}

module.exports = {
    GetUser,
    SigninWithEmail,
    SignupWithEmail,
    Signup,
    Signin,
    Signout
}