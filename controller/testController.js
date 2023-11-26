const testControllers = (req, res) => {
    return res.status(200).send({
        message: "this is for testing router how can we soure this is a right route ", success: true,
    });
}


export default testControllers