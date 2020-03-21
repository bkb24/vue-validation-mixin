const defaultMessages = {
    _default:   'Полето е попълнено неправилно',

    required:   'Полето е задължително',
    min:        'Полето трябва да е поне %{} символа',
    max:        'Полето не може да е повече от %{} символа',
    email:      'Невалиден email',
    pattern:    'Попълни ли Сте невалидни данни',
    gt:         'Полето трябва да е по-голямо от %{}',
    filetypes:  'Файлът трябва да е само тип: %{}'
}

export default {
    data() {
        return {
            // If validation was triggered at least once
            validationTriggered: false,

            // should be filled in the component
            errors: {
                // name: '',
                // password: '',
                // email: ''
            },

            // custom messages
            errorMessages: {
                // name: {
                    // required: 'You need a name'
                // }
            },

            // should be filled in the component
            form: {
                // name: '',
                // email: '',
            },

            // Use this if you wish to make validation use validator methods
            // should be filled in the component
            // validations: {
                // name: 'required|min:2|max:30',
                // email: 'func:validateEmail' - use a custom made method on the instance
            // }
        }
    },

    methods: {
        onChange(e) {
            this.form[e.target.name] = e.target.value

            if (this.validationTriggered) this.tiggerValidation(e)
        },

        onBlur(e) {
            this.tiggerValidation(e)
        },

        tiggerValidation(e) {
            if (this.validations) return this.validateField(e.target.name);

            this.validate();
        },

        validateField(fieldName) {
            this.validationTriggered = true

            let validations = this.validations[fieldName].split('|')

            if (validations.includes('required')) {
                if (!validators.required(this.form[fieldName])) {
                    this.setValidationError(fieldName, 'required')
                    return;
                }
            }

            if (validations.includes('sometimes')) {
                if (!validators.required(this.form[fieldName])) return;

                validations.splice(validations.indexOf('sometimes'), 1)
            }

            this.errors[fieldName] = ''

            // loop through all rules for a field
            for (let i = 0; i < validations.length; i++) {
                let { rule, value, isValid } = this.validateRule(fieldName, validations[i])

                // fill in the error message
                if (!isValid)
                    this.setValidationError(fieldName, rule, value)
            }
        },

        validateFunc(fieldName, functionName) {
            return this[functionName](this.form[fieldName])
        },

        validateExists(fieldName, value) {
            let existsCollection = helpers.existsCollection.bind(this)
            let { collection, prop } = existsCollection(value)
            return validators.exist(this.form[fieldName], collection, prop)
        },

        validateForm() {
            Object.keys(this.validations).forEach(data => {
                this.validateField(data)
            })
        },

        validateRule(fieldName, ruleData) {
            let rule = ''
            let value = null
            let isValid = true

            let parts = ruleData.split(':')

            // if rule has a parameter
            if (parts.length > 1) {
                [rule, value] = parts

                if (rule === 'exist') {
                    isValid = this.validateExists(fieldName, value)
                } else if (rule === 'existIn') {
                    isValid = validators.existIn.bind(this)(this.form[fieldName], this[value])
                } else if (rule === 'doesNotExistIn') {
                    isValid = validators.doesNotExistIn.bind(this)(this.form[fieldName], this[value])
                } else if (rule === 'func') {
                    isValid = this.validateFunc(fieldName, value)
                } else {
                    isValid = validators[rule](this.form[fieldName], value)
                }

            } else {
                rule = ruleData
                isValid = validators[rule](this.form[fieldName])
            }

            return { rule, value, isValid }
        },

        setValidationError(fieldName, rule, value) {
            let error = ''

            if (this.errorMessages[fieldName] && this.errorMessages[fieldName][rule]) {
                error = this.errorMessages[fieldName][rule].replace('%{}', value)
            } else if (defaultMessages[rule]) {
                error = defaultMessages[rule].replace('%{}', value)
            } else {
                error = defaultMessages._default
            }

            this.errors[fieldName] = error
        },

        checkForm() {
            return Object.values(this.errors).filter(Boolean).length < 1
        },

        // Add this function in a component if you wish to gave a custom validation
        // for the form
        // validate() {

        // }
    },

    computed: {
        isValid() {
            return this.checkForm()
        }
    }
}

export const validators = {
    required(data) {
        return data !== null && data !== ''
    },

    max(data, max) {
        return data.length <= max
    },

    min(data, min) {
        return data.length >= min
    },

    gt(data, than) {
        return data > than
    },

    pattern(data, pattern) {
        return pattern.test(data)
    },

    number(data) {
        return !Number.isNaN(data)
    },

    integer(data) {
        return Number.isInteger(data)
    },

    email(data) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data)
    },

    file(data) {
        return data instanceof File
    },

    filetypes(data, typesData) {
        if (!validators.file(data)) return false

        let types = typesData.split(',')
        var ext = data.name.split('.').pop();
        return types.includes(ext)
    },

    size(data, max) {
        if (validators.file(data)) {
            // data.size is in bytes
            return (data.size / 1000) <= max
        }
        return data.length <= max
    },

    in(data, terms) {
        return terms.split(',').includes(data)
    },

    notIn(data, terms) {
        return !terms.split(',').includes(data)
    },

    exist(data, collection, prop) {
        return collection.filter(item => item[prop] == data).length > 0
    },

    existIn(data, collection) {
        return collection.includes(data)
    },

    doesNotExistIn(data, collection) {
        return !collection.includes(data)
    },
}

const helpers = {

    // existData is like category,id
    // or like work.category,id
    existsCollection(existsData) {
        let [collectionName, prop] = existsData.split(',')

        let propChain = collectionName.split('.')
        let propChainIt = propChain[Symbol.iterator]();

        let collection = null
        let start = false

        for (let prop of propChainIt) {
            if (start === false) {
                collection = this[prop]
                start = true
            } else {
                collection = collection[prop]
            }
        }

        return { collection, prop }
    }

}
