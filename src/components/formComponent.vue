<template>
    <form class="form" @submit.prevent="$emit('submit', formData)">
    <div class="form-group text-center">
        <div v-for="input in inputs" :key="input.id">
            <label :for="input.id">{{ input.label }}</label>
            <input
            v-if="input.type === 'text' || input.type === 'email' || input.type === 'password' || input.type === 'number' ||  input.type === 'date'"
            :type="input.type"
            class="form-control"
            :id="input.id"
            v-model="formData[input.id]"
            :placeholder="input.placeholder"
            :disabled="input.disabled ?? false "
            :required="input.required ?? false"
            />
            <select
                v-if="input.type === 'select'"
                class="form-control"
                :name="input.id"
                v-model="formData[input.id]"
                :required="input.required ?? false"
            >
                <option v-for="option in input.options" :key="option.value" :value="option.value">
                    {{ option.text }}
                </option>
            </select>

            <textarea
                v-if="input.type === 'textarea'"
                class="form-control"
                rows="4"
                :id="input.id"
                v-model="formData[input.id]"
                :placeholder="input.placeholder"
                :disabled="input.disabled ?? false"
                :required="input.required ?? false"
            ></textarea>

            
        </div>
        
        <hr />
            <button :class="class_btn" type="submit">{{ label_button }}</button>
            <button class="btn btn-light" data-dismiss="modal">Fermer</button>
        
    </div>
    </form>
</template>
<script>
export default {
    name: 'formComponent',
    props: {
        inputs: {
            type: Array,
        },
        label_button: {
            type: String,
        },
        class_btn: {
            type: String,
            default: 'btn btn-primary'
        }

    },
    data() {
    return {
        formData: {}
    }
    },
    watch: {
    inputs: {
        immediate: true,   // Le handler est exécuté dès que le composant est monté
        deep: true,        // Il observe les changements profonds (dans les objets du tableau)
        handler(newInputs) {
        const formdata = {}
        newInputs.forEach(input => {
            formdata[input.id] = input.initialValue || ''
        })
        this.formData = formdata
        }
    }
    },
    methods: {

    },
    emits: ['submit']
}
</script>