const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const chalk = require("chalk");
const tokenService = require("../services/token.service");

const router = express.Router({ mergeParams: true });

router.post("/signUp", [
    check("email", "Некорректно введен email").isEmail(),
    check("password", "Минимальная длина пароля 8 символов").isLength({
        min: 8,
    }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: {
                        message: "IN_VALID_DATA",
                        code: 400,
                        errors: errors.array(),
                    },
                });
            }
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    error: {
                        message: "EMAIL_EXISTS",
                        code: 400,
                    },
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = User.create({
                ...req.body,
                password: hashedPassword,
            });

            const tokens = tokenService.generate({ _id: newUser._id });

            await tokenService.save((await newUser)._id, tokens.refreshToken);

            res.status(201).send({
                ...tokens,
                userId: newUser._id,
            });
            console.log(
                chalk.blueBright(`User response created - ${await newUser}`)
            );
        } catch (e) {
            res.status(500).json({
                message: "Что то пошло не так",
            });
        }
    },
]);
router.post(
    "/signIn",
    check("email", "Email введен некорректно").normalizeEmail().isEmail(),
    check("password", "Пароль введен некорректно").exists(),
    [
        async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: {
                            message: "IN_VALID_DATA",
                            code: 400,
                            errors: errors.array(),
                        },
                    });
                }
                const { email, password } = req.body;

                const existingUser = await User.findOne({ email });

                if (!existingUser) {
                    return res.status(400).send({
                        error: {
                            message: "EMAIL_NOT_FOUND",
                            code: 400,
                        },
                    });
                }

                const isPasswordEqual = await bcrypt.compare(
                    password,
                    existingUser.password
                );
                if (!isPasswordEqual) {
                    return res.status(400).send({
                        error: {
                            message: "INVALID_PASSWORD",
                            code: 400,
                        },
                    });
                }

                const tokens = tokenService.generate({ id: existingUser._id });
                await tokenService.save(existingUser._id, tokens.refreshToken);

                res.status(200).send({ ...tokens, userId: existingUser._id });

                console.log(
                    chalk.blueBright(`User found - ${await existingUser}`)
                );
            } catch (error) {
                return res.status(500).json({
                    message: "Что то пошло не так",
                });
            }
        },
    ]
);

router.post("/token", async (req, res) => {
    try {
        const { refresh_token: refrechToken } = req.body;
        const data = await tokenService.validateRefresh(refrechToken);
        console.log(data);
        res.status(200).send({ data });
    } catch (e) {
        res.status(500).json({
            message: "Что то пошло не так",
        });
    }
});

module.exports = router;
