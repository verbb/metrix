import {
    string,
    number,
    object,
    optional,
    pipe,
    nonEmpty,
    minLength,
    maxLength,
} from 'valibot';

const validationRules = {
    required: {
        apply: (schema, rule, field) => {
            const message = Craft.t('metrix', '{attribute} is required.', { attribute: field.label });

            return pipe(schema, nonEmpty(message));
        },
    },
    minLength: {
        apply: (schema, rule, field) => {
            const message = Craft.t('metrix', '{attribute} must be at least {value} characters long.', {
                attribute: field.label,
                value: rule.value,
            });

            return pipe(schema, minLength(rule.value, message));
        },
    },
    maxLength: {
        apply: (schema, rule, field) => {
            const message = Craft.t('metrix', '{attribute} must be no more than {value} characters long.', {
                attribute: field.label,
                value: rule.value,
            });

            return pipe(schema, maxLength(rule.value, message));
        },
    },
};

const getBaseSchema = (validation) => {
    if (validation?.type === 'number') {
        return number();
    }

    return string();
};

export const createValidationSchema = (fields) => {
    const validationObject = fields.reduce((acc, field) => {
        let fieldSchema = getBaseSchema(field.validation);

        if (field.validation) {
            Object.entries(field.validation).forEach(([ruleName, ruleValue]) => {
                const ruleHandler = validationRules[ruleName];

                if (ruleHandler) {
                    fieldSchema = ruleHandler.apply(fieldSchema, { value: ruleValue }, field);
                } else if (ruleName !== 'type') {
                    console.warn(`Unsupported validation rule: ${ruleName}`);
                }
            });
        }

        acc[field.name] = field.validation?.required ? fieldSchema : optional(fieldSchema);

        return acc;
    }, {});

    return object(validationObject);
};
