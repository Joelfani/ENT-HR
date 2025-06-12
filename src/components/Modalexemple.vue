    <template>
        <div
        class="modal fade"
        :id="modal.id"
        tabindex="-1"
        role="dialog"
        aria-labelledby="form_add"
        aria-hidden="true"
        >
        <div class="modal-dialog modal-dialog-centered modal_container_pop" role="document">
            <div class="modal-content">
            <div class="common_container modal_container">
                <section class="common_section">
                <div class="header_name_modal">
                    <span class="section_name">{{ modal.title }}</span>
                </div>
                <hr />
    
                <!-- Error Modal -->
                <template v-if="modal.isError">
                    <h3 style="font-weight: bold; color: red;">ACCES NON AUTORISER</h3>
                    <hr />
                    <button class="btn btn-danger" data-dismiss="modal">Fermer</button>
                </template>
    
                <!-- Year Contest Modal -->
                <template v-else-if="modal.isYearContest">
                    <label>Ajouter année concours</label>
                    <form @submit.prevent="handleAddYear">
                    <div class="select-promotion">
                        <input type="number" min="2000" v-model="newYear" required />
                        <button type="submit" class="btn btn-success btn-confirm">Ajouter</button>
                    </div>
                    </form>
                    <p style="color: rgb(0, 223, 0);">{{ text_can }}</p>
                    <p class="erreur">{{ err_can }}</p>
                    <hr />
                    <label>Selection de l'année de concours à Supprimer</label>
                    <div class="select-promotion">
                    <select class="form-control" v-model="annee_supr">
                        <option
                        v-for="promy in promotions"
                        :key="promy.id"
                        :value="promy.id"
                        >{{ promy.name }}</option>
                    </select>
                    <button
                        class="btn btn-danger btn-confirm"
                        data-dismiss="modal"
                        @click="deleteYear"
                    >Supprimer</button>
                    </div>
                </template>
    
                <!-- Selection Modal -->
                <template v-else>
                    <label>{{ modal.isCandidate ? "Selection de l'année de concours" : "Selection de la promotion" }}</label>
                    <div class="select-promotion">
                    <select class="form-control" v-model="localSelectedProm">
                        <option
                        v-for="promy in promotions"
                        :key="promy.id"
                        :value="promy.id"
                        >{{ promy.name }}</option>
                    </select>
                    <button
                        class="btn btn-dark btn-confirm"
                        data-dismiss="modal"
                        @click="confirm"
                    >Confirmer</button>
                    </div>
                </template>
                </section>
            </div>
            </div>
        </div>
        </div>
    </template>
    
    <script>
    export default {
        name: 'ModalComponent',
        props: {
        modal: {
            type: Object,
            required: true,
        },
        promotions: {
            type: Array,
            required: true,
        },
        selectedProm: {
            type: [String, Number],
            default: '',
        },
        text_can: {
            type: String,
            default: '',
        },
        err_can: {
            type: String,
            default: '',
        },
        },
        data() {
        return {
            localSelectedProm: this.selectedProm,
            newYear: '',
            annee_supr: '',
        };
        },
        watch: {
        selectedProm(newVal) {
            this.localSelectedProm = newVal;
        },
        },
        methods: {
        confirm() {
            this.$emit('confirm', this.modal.action, this.localSelectedProm);
        },
        handleAddYear() {
            this.$emit('add-year', this.newYear);
            this.newYear = '';
        },
        deleteYear() {
            this.$emit('delete-year', this.annee_supr);
        },
        },
    };
    </script>
    
    <style scoped>
    .modal_container {
        padding: 20px;
    }
    
    .header_name_modal {
        text-align: center;
        margin-bottom: 10px;
    }
    
    .section_name {
        font-size: 1.2em;
        font-weight: bold;
    }
    
    .select-promotion {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .btn-confirm {
        margin-top: 10px;
    }
    
    .erreur {
        color: red;
    }
    </style>