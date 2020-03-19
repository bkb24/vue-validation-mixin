# vue-validation-mixin

**VERY IMPORTANT MESSAGE: EVEN THOUGH THIS HAS BEEN USED ON A REAL PROJECT IT HAS NOT BEEN TESTED BY A TRAINED SPECIALIST AND SUPPORT IS NOT A GIVEN, ALSO IT MIGHT NOT WORK FOR YOU**

**YOU ARE AT FAULT IF THIS CRAPS YOUR STUFF**

**IT IS FOR EXPERIMENTING**

**THANK YOU**


This is a simple form validation example. The most important code is in a vue mixin in _src/mixins/validation.js_
This particular set up uses vue-cli

## Example setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

## Usage

The mixins adds several methods and data properties plus one computed property to the component.

The data properties:

**validationTriggered**

_Boolean_

It is false by default. You can set it to true in your component. It is used to flag when a validation has been run in order and to prevent running it before hitting submit if you prefer that way. When is false at the beginning and you start typing in a form field and move the focus out the validation won't run


**form**

_object_

This is the object with all properties that are v-model bound and to be validated. The _name_ attribute of the form element has to match the property name in the form object. These here are empty by default, but if it is an edit page obviously some or all of them would have some values

```
form: {
    email: '',
    username: '',
    password: '',
    bio: ''
}
```
Then you have for example the email field in your template:

```
<input id="email" type="text" name="email" @blur="onBlur" v-model="form.email" />
```

You do not need the blur event if you do not want it


**validations**

_object_

An object with the fields rules. Now this is not required. If you want to have a custom validation you need to not add this property to the component and will need to create a _validate_ method and use it instead.

Example:

```
validations: {
    email:          'required|email|max:255',
    username:       'required|max:30|min:3',
    password:       'required|max:30|min:8',
    bio:            'sometimes|max:100',
    ...

    price:          'required|number|gt:0',
    ...
    file:           'sometimes|file|filetypes:pdf,docx|size:51200',
    ...
    attached_file:  'func:validateAttached'
    ...
}
```

The rules are separated with a pipe. You can see all the rules in the mixin or even include then and us them as methods to validate other data. You can also add tour own or make changes or whatever you want. There are different kinds of rules that use different syntax. Scroll down to see the rules

**errors**

This is an object that holds the errors so you can show them afterwards

```
errors: {
    name: '',
    password: '',
    email: ''
},
```
And to display them just do this or something alike:

```
<div class="error">{{ errors.email }}</div>
```

**errorMessages**

Personalize error messages for all rules. You can also replace my default ones in _src/mixins/validation.js_

```
errorMessages: {
    email: {
        required: 'Email is required',
        email: 'Email is not valid',
        max: 'Email can not be over %{} characters'
    },
},
```

default messages:

```
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
```

The _default is used for all not present in *defaultMessages* or in your *errorMessages*

* In errors you only have one error message regardless of how many rules are broken.


## Methods
Now, you see there are a few methods right here. The focus will be on the ones that you will use directly inside the component.

_validate_

A user defined method, not implemented in the mixin. You use this if you don't want to use the _validations_ property with rules. So if there is no _validations_ when the validation is run this function is triggered

_onChange_

This is supposed to run validaiton on form element change, but you can run the function on other events. It also sets the form element to the value changed

```
<input type="text" name="name" @input="onChange"/>
```

_onBlur_
This is made to be used on form element blur

```
<input id="email" type="text" name="email" @blur="onBlur" v-model="form.email" />
```

_validateForm_

This one runs the validation rules on all fields and fills the errors

_checkForm_

Checks if there are errors. Could use it to submit form or do some ajax stuff for example

## Computed

isValid

Uses _checkForm_ under the hood. Well it could be used it to enable/disable the submit button

## Validation Rules

**required**

The field is required

```
validations {
    ...
    coolHat: 'required'
}
```

**sometimes**

The field is not required, but if it is present it will validate all the rules piped with it. Example:

```
validations {
    ...
    bio: 'sometimes|max:100',
}
```

So that means if _bio_ is empty calidation passes no issues, but if there is a _bio_ it is going to get validated and when length is over 100 characters then is invalid

**max** _(max:[number])_

Do not allow the length of the value to be more than the _number_ you give. So the username's maximum length below can not be more than 10 characters long

```
validations {
    ...
    username: 'max:10'
}
```


**min** _(min:[number])_

Like max but restrict minumum length

```
validations {
    ...
    username: 'min:3'
}
```


**gt** _(gt:[number])_

The value should be grater than. It is made to work wit numbers


```
validations {
    ...
    jordansPrice: 'gt:100'
}
```


**pattern** _(pattern:[pattern])_

Basically regex test. This tests against a given pattern. Obviously this could not work for every pattern since you can not _pipe_ (|) in the regex, because it is used for separating multiple rules. To use whatever pattern of choice the solution could be to use the _func_ rule

```
validations {
    ...
    alphaNumSecret: 'pattern:/^[a-zA-Z0-9]+$/'
}
```


**number**

The value must be a number - integer or a float

```
validations {
    ...
    price: 'number'
}
```


**integer**

The value must be an integer

```
validations {
    ...
    brainCells: 'integer'
}
```


**email**

Check if the field is a valid email. This is the pattern ran against it: `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`

```
validations {
    ...
    email: 'email'
}
```


**file**

The value should be a file. Used for attachments and so on

```
validations {
    ...
    selfie: 'file'
}
```


**filetypes** _(filetypes:[typesData])_

Acceptable file types for the file uploaded

```
validations {
    ...
    selfie: 'filetypes:jpg,jpeg,png'
}
```


**size** _(size:[maxSize])_

Max size of the given value. If is a file it means maximum file size in KB, if not it is maximum length

```
validations {
    ...
    selfie: 'size:1024'
}
```
_or_

```
validations {
    ...
    abbreviation: 'size:3'
}
```


**exist** _(exist:[collection, prop])_

Find out if the given property (_prop_) is in the collection. The collection is a property of the component, mostly in the data.
Now the example in the repository there is a data property categories with all user categories. But in select there is a new category not present in that property. It is a stupid example but it is just for illustration

Example:

```
data() {
    return {
        ...
        categories: [
            { option: 'casual', text: 'Casual' },
            { option: 'regular', text: 'Regular' },
            { option: 'maniac', text: 'Maniac' }
        ],
    }
}
```

The v-model binding is done and an extra option in the select is added at first place:

```
<select id="category" name="category" class="form-input" v-model="form.category" @blur="onBlur">
    <option value="weird">Weird (This will give an error)</option>
    <option v-for="category in categories" v-bind:key="category.option" v-bind:value="category.option">
        {{ category.text }}
    </option>
</select>
```

For the validation you need to validate _form.category_ against the selected category._option_. So the object looks like this:

```
validations {
    ...
    category:   'exist:categories,option'
}
```

And it searches the categories data property for a category with an option that was chosen

Now the collection could be a deeper property of data property for example. You can get to it by giving the whole path/hierarchy separating different levels with a dot:

If the data is like this:

```
data() {
    return {
        ...
        stuff: {
            categories: [
                { option: 'casual', text: 'Casual' },
                { option: 'regular', text: 'Regular' },
                { option: 'maniac', text: 'Maniac' }
            ],
        }
    }
}
```
You need a rule like this:

```
validations {
    ...
    category:   'exist:stuff.categories,option'
}
```

## Simple example

Full component. All the good stuff

```
<template>

    <form @submit="submit">
        <div>
            <label for="name">Give me your name</label>
            <input id="name" name="name" type="text" v-model="form.name" @blur="onBlur" />
            <div class="error">{{ errors.name }}</div>
        </div>

        <button type="submit">Give it to me</button>

    </form>

</template>

<script>
import validation from './mixins/validation' // or path to the mixin

export default {
    name: 'App',

    data() {
        return {
            form: {
                name: '',
            },

            validations: {
                name: 'required|max:30|min:3',
            },

            errors: {
                name: '',
            },

            errorMessages: {
                name: {
                    required: 'Your name is required',
                    min: 'Your name can not be less than %{} characters',
                    max: 'Your name can not be more than %{} characters'
                }
            },

        }
    },

    methods: {
        submit(e) {
            e.preventDefault()

            this.validateForm()
            if (!this.checkForm()) return

            // sophisticated front end engineering or

            alert('Thank you!')
        }
    },

    mixins: [validation]

}
</script>
```
