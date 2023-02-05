const express = require("express");
const { check, validationResult } = require("express-validator");
const chalk = require("chalk");
const Content = require("../models/Content");
const router = express.Router({ mergeParams: true });

router.post(
    "/create",

    [
        check("title", "Заполните поле title").isLength({
            min: 1,
        }),
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty) {
                    return res.status(400).json({
                        error: {
                            message: "INVALID_DATA",
                            code: 400,
                            errors: errors.array(),
                        },
                    });
                }
                const { title } = req.body;
                const exitingUser = await Content.findOne({ title });
                if (exitingUser) {
                    return res.status(400).json({
                        error: {
                            message: "TITLE_EXISTS",
                            code: 400,
                        },
                    });
                }

                const newContent = Content.create({
                    ...req.body,
                    id: Date.now(),
                });

                res.status(201).send({
                    user: await newContent,
                });
                console.log(
                    chalk.blueBright(
                        `Created new content - ${await newContent}`
                    )
                );
            } catch (error) {
                return res.status(500).json({
                    message: "Что то пошло не так, так что вали от сюда",
                });
            }
        },
    ]
);
router.get("/getAll", async (req, res) => {
    try {
        const list = await Content.find();
        res.status(200).send(list);
    } catch (error) {
        res.status(500).json({
            message: "Сервер сдох",
        });
    }
});
module.exports = router;
