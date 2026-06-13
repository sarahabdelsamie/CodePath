const Joi = require("joi");

const registerSchema = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("learner", "mentor").default("learner"),
    learningPath: Joi.string()
      .valid("frontend", "backend", "ai", "mobile")
      .when("role", {
        is: "learner",
        then: Joi.required(),
        otherwise: Joi.optional().allow("", null),
      }),
    skillLevel: Joi.string()
      .valid("beginner", "intermediate")
      .when("role", {
        is: "learner",
        then: Joi.required(),
        otherwise: Joi.optional().allow("", null),
      }),
  });

  return schema.validate(data);
};

const loginSchema = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

const updateProfileSchema = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    learningPath: Joi.string().valid("frontend", "backend", "ai", "mobile").optional(),
    skillLevel: Joi.string().valid("beginner", "intermediate").optional(),
  });

  return schema.validate(data);
};

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};