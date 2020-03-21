<template>
    <div id="app">

        <form @submit="submit" v-if="!submitted">

            <div class="form-line">
                <label for="category">user category</label>

                <select id="category" name="category" class="form-input" v-model="form.category" @blur="onBlur">
                    <option value="weird">Weird (This will give an error)</option>
                    <option v-for="category in categories" v-bind:key="category.option" v-bind:value="category.option">
                        {{ category.text }}
                    </option>
                </select>

                <div class="error">{{ errors.category }}</div>
            </div>

            <div class="form-line">
                <label for="email">email</label>
                <input id="email" type="text" name="email" @blur="onBlur" v-model="form.email" />

                <div class="error">{{ errors.email }}</div>
            </div>

            <div class="form-line">
                <label for="username">username</label>
                <input id="username" type="text" name="username" @blur="onBlur" v-model="form.username" />

                <div class="error">{{ errors.username }}</div>
            </div>

            <div class="form-line">
                <label for="password">password</label>
                <input id="password" type="password" name="password" @blur="onBlur" v-model="form.password" />

                <div class="error">{{ errors.password }}</div>
            </div>

            <div class="form-line">
                <label for="bio">short bio</label>
                <textarea id="bio" type="text" name="bio" @blur="onBlur" v-model="form.bio"></textarea>

                <div class="error">{{ errors.bio }}</div>
            </div>

            <div class="form-line form-line--consent">
                <input id="consent" type="checkbox" name="consent" @blur="onBlur" v-model="form.consent" />
                <label for="consent">
                    You allow us to use your information for the purposes of this educational material.
                    Don't wory we don't use cookies.</label>

                <div class="error">{{ errors.consent }}</div>
            </div>

            <button class="btn">Submit</button>

        </form>

        <div v-else class="success-message">Your information was successfully sent to the public</div>

    </div>
</template>

<script>
import validation from './mixins/validation'

export default {
    name: 'App',

    data() {
        return {
            submitted: false,

            categories: [
                { option: 'casual', text: 'Casual' },
                { option: 'regular', text: 'Regular' },
                { option: 'maniac', text: 'Maniac' }
            ],

            registeredUsernames: ['bkb24', 'number24'],

            validationTriggered: true,

            form: {
                email:      '',
                username:   '',
                password:   '',
                bio:        '',
                category:   '',
                consent:    false
            },

            validations: {
                email:      'required|email|max:255|notIn:admin@email.com,support@email.com',
                username:   'required|alphaNum|max:30|min:3|doesNotExistIn:registeredUsernames',
                password:   'required|max:30|min:8',
                bio:        'sometimes|max:100',
                category:   'exist:categories,option',
                consent:    'accepted'
            },

            errors: {
                email: '',
                username: '',
                password: '',
                bio: '',
                category: '',
                consent: ''
            },

            errorMessages: {
                email: {
                    required: 'Email is required',
                    email: 'Email is not valid',
                    max: 'Email can not be over %{} characters',
                    notIn: 'Email must not be admin@email.com or support@email.com'
                },
                username: {
                    required: 'Username is required',
                    alphaNum: 'Username can have only letters and numbers',
                    min: 'Username can not be under %{} characters long',
                    max: 'Username can not be over %{} characters long',
                    doesNotExistIn: 'This username is in use already'
                },
                password: {
                    required: 'Password is required',
                    min: 'Password can not be under %{} characters long',
                    max: 'Password can not be over %{} characters long'
                },
                bio: {
                    max: 'Bio can not be over %{} caracters long'
                },
                category: {
                    exist: 'This user category does not exist'
                },
                consent: {
                    accepted: 'Consent is needed from you so we can use your stuff'
                }
            },

        }
    },

    methods: {
        submit(e) {
            e.preventDefault()

            this.validateForm()
            if (!this.checkForm()) return

            this.submitted = true
        }
    },

    mixins: [validation]

}
</script>

<style lang="scss">
body {
    background: #f7f7f7;
    text-align: center;
}

#app {
    display: inline-block;
    width: 400px;

    margin: auto;
    margin-top: 5rem;
    padding: 4rem;

    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .1);

    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
}

label {
    display: inline-block;
    width: 10rem;
}

.form-line {
    display: flex;
    flex-wrap: wrap;
}

.form-line--consent {
    margin-bottom: 2rem;

    label {
        width: 90%;
    }

    .error {
        padding-left: 0;
    }
}

input, textarea, select {
    flex-grow: 1;
    border-radius: 5px;
    padding: .5rem;
    border: 1px solid #eee;
    box-shadow: inset 0 0 5px rgba($color: #000000, $alpha: .05);

    &:focus {
        border: 1px solid #ddd;
    }

    & + .error {
        margin-bottom: .55rem;
    }

    & + .error:empty {
        margin-bottom: 1.6rem;
    }
}

.error {
    width: 100%;
    margin-top: .25rem;
    padding-left: 10rem;

    font-size: .9rem;
    color: #aa1f1f;
}

button {
    padding: 1rem 2rem;

    border: 2px solid transparent;
    border-radius: 2rem;
    background: #2c3e50;
    color: #fff;

    cursor: pointer;

    &:hover {
        background: #fff;
        color: #2c3e50;
        border: 2px solid #2c3e50;
    }
}

.success-message {
    text-align: center;
}

</style>
