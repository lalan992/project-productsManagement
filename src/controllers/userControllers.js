const UserModel = require("../Models/userModel");
const validator = require('../validator/validators');







const createUser = async function (req, res) {
    try {
        let body = JSON.parse(JSON.stringify(req.body))

        //Validate body 
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        let { fname, lname, email, password, phone, address } = body

        // Validate fname
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname must be present" })
        }

        // Validation of fname
        if (!validator.isValidName(fname)) {
            return res.status(400).send({ status: false, msg: "Invalid fname" })
        }

        // Validate lname
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname must be present" })
        }

        // Validation of lname
        if (!validator.isValidName(lname)) {
            return res.status(400).send({ status: false, msg: "Invalid lname" })
        }

        // Validate email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "email must be present" })
        }

        // Validation of email id
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid email id" })
        }

        // Validate password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password must be present" })
        }

        // Validation of password
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" })
        }

        // Validate phone
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone must be present" })
        }

        // Validation of phone number
        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, msg: "Invalid phone number" })
        }

        // Validate address
        if (!address) {
            return res.status(400).send({ status: false, message: "Address is required" })
        }
        address = JSON.parse(address)
        if (typeof address != "object") {

            return res.status(400).send({ status: false, message: "address should be an object" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};
