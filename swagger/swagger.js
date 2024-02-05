const swaggerUi = require("swagger-ui-express");
const swaggereeJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Yanu",
            description:
            "Yanu Express",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.js"],
}

const specs = swaggereeJsdoc(options)

module.exports = { swaggerUi, specs}