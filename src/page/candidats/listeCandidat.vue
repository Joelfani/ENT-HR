<template>
    <LoadingComponent v-if="isLoading" dataload="des candidats" />
    <div v-else>
        <a v-if="userStore.add" class="btn btn-success btn-lg" data-toggle="modal" data-target="#add_candidat"> Ajouter </a>

        <TableComponent :columns="columns" :rows="candidats">
            <template #actions="{ item }">
                <TableAction :id="item.id" title="le candidat" table-suppr="candidat" tableEdit="candidat" @mod_data="dataInitialFormMod">
                    <template #form_modifier>
                        <FormComponent :inputs="input_mod" label_button="Modifier" @submit="modCandidat"/>
                    </template>
                </TableAction>
            </template>
        </TableComponent>

        <!--Modal for adding a new candidat-->
        <ModalComponent id="add_candidat" title="Ajouter un candidat">
            <FormComponent :inputs="input_add" label_button="Ajouter" @submit="addCandidat"/>
        </ModalComponent>
    </div>
</template>

<script>
import FormComponent from '@/components/formComponent.vue';
import LoadingComponent from '@/components/loadingComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import TableAction from '@/components/TableAction.vue';
import TableComponent from '@/components/TableComponent.vue';
import { useSubscribeStore } from '@/store/realtime';
import { useUserStore } from '@/store/user';
import { supabase } from '@/supabase';
import { mapStores } from 'pinia';

export default {
    name: 'CandidatEleve',
    components: {
        TableComponent,
        LoadingComponent,
        TableAction,
        FormComponent,
        ModalComponent,
    },
    data() {
        return {
            isLoading: true,
            candidats: [],
            columns: [
                { key: 'id', label: "ID" },
                { key: 'situ', label: "Situ" },
                { key: 'nom', label: "Nom" },
                { key: 'filiere', label: 'Filière' },
                { key: 'filiere2', label: 'Filière 2' },
                { key: 'prom', label: 'Promotion' },
                { key: 'genre', label: 'Genre' },
                { key: 'naiss', label: 'Naissance' },
                { key: 'tel', label: 'Téléphone' },
                { key: 'adresse', label: 'Adresse' },
                { key: 'mail', label: 'Email' },
                { key: 'obs', label: 'Observations' },
                { key: 'age', label: 'Âge' },
                { key: 'lieu', label: 'Lieu' },
                { key: 'niveau', label: 'Niveau' },
                { key: 'diplome', label: 'Diplôme' },
                { key: 'resp', label: 'Responsable' },
                { key: 'respnom', label: 'Nom Responsable' },
                { key: 'lien', label: 'Lien' },
                { key: 'situation', label: 'Situation' },
                { key: 'raison', label: 'Raison' },
                { key: 'tel2', label: 'Téléphone 2' },
                { key: 'fb', label: 'Facebook' },
                { key: 'ville', label: 'Ville' },
                { key: 'milieu', label: 'Milieu' },
                { key: 'finance', label: 'Finance' },
                { key: 'etat', label: 'État' },
                { key: 'pro1', label: 'Pro 1' },
                { key: 'pro2', label: 'Pro 2' },
                { key: 'pro3', label: 'Pro 3' },
                { key: 'pres', label: 'Pres' },
                { key: 'log', label: 'Log' },
                { key: 'frat', label: 'Frat' },
                { key: 'frat2', label: 'Frat 2' },
                { key: 'elec', label: 'Elec' },
                { key: 'revenu', label: 'Revenu' },
                { key: 'fixe', label: 'Fixe' },
                { key: 'autre', label: 'Autre' },
                { key: 'comment', label: 'Commentaire' },
                { key: 'frso', label: 'FRSO' },
                { key: 'frse', label: 'FRSE' },
                { key: 'maths', label: 'Maths' },
                { key: 'ang', label: 'Anglais' },
                { key: 'motiv', label: 'Motivation' },
                { key: 'obs2', label: 'Observations 2' },
            ],
            initialValues: {},
            add_initialValue: {
                situ: '',
                nom: '',
                filiere: '',
                filiere2: '',
                prom: '',
                genre: '',
                naiss: '',
                tel: '',
                adresse: '',
                mail: '',
                obs: '',
                age: '',
                lieu: '',
                niveau: '',
                diplome: '',
                resp: '',
                respnom: '',
                lien: '',
                situation: '',
                raison: '',
                tel2: '',
                fb: '',
                ville: '',
                milieu: '',
                finance: '',
                etat: '',
                pro1: '',
                pro2: '',
                pro3: '',
                pres: '',
                log: '',
                frat: '',
                frat2: '',
                elec: '',
                revenu: '',
                fixe: '',
                autre: '',
                comment: '',
                frso: '',
                frse: '',
                maths: '',
                ang: '',
                motiv: '',
                obs2: '',
            },
        };
    },
    computed: {
        ...mapStores(useUserStore, useSubscribeStore),
        input_add() {
            return [
                { id: 'situ', type: 'text', label: "Situation", placeholder: "Entrez la situation", initialValue: this.add_initialValue.situ, required: false },
                { id: 'nom', type: 'text', label: "Nom", placeholder: "Entrez le nom", initialValue: this.add_initialValue.nom, required: true },
                { id: 'filiere', type: 'text', label: 'Filière', placeholder: 'Entrez la filière', initialValue: this.add_initialValue.filiere, required: false },
                { id: 'filiere2', type: 'text', label: 'Filière 2', placeholder: 'Entrez la filière secondaire', initialValue: this.add_initialValue.filiere2, required: false },
                { id: 'prom', type: 'text', label: 'Promotion', placeholder: 'Entrez la promotion', initialValue: this.add_initialValue.prom, required: false },
                { id: 'genre', type: 'select', label: 'Genre', initialValue: this.add_initialValue.genre, options: [
                    { value: '', text: 'Sélectionnez le genre' },
                    { value: 'M', text: 'Masculin' },
                    { value: 'F', text: 'Féminin' }
                ], required: false },
                { id: 'naiss', type: 'date', label: 'Date de naissance', initialValue: this.add_initialValue.naiss, required: false },
                { id: 'tel', type: 'tel', label: 'Téléphone', placeholder: 'Entrez le numéro de téléphone', initialValue: this.add_initialValue.tel, required: false },
                { id: 'adresse', type: 'text', label: 'Adresse', placeholder: 'Entrez l\'adresse', initialValue: this.add_initialValue.adresse, required: false },
                { id: 'mail', type: 'email', label: 'Email', placeholder: 'Entrez l\'email', initialValue: this.add_initialValue.mail, required: false },
                { id: 'age', type: 'number', label: 'Âge', placeholder: 'Entrez l\'âge', initialValue: this.add_initialValue.age, required: false },
                { id: 'lieu', type: 'text', label: 'Lieu', placeholder: 'Entrez le lieu', initialValue: this.add_initialValue.lieu, required: false },
                { id: 'niveau', type: 'text', label: 'Niveau', placeholder: 'Entrez le niveau', initialValue: this.add_initialValue.niveau, required: false },
                { id: 'diplome', type: 'text', label: 'Diplôme', placeholder: 'Entrez le diplôme', initialValue: this.add_initialValue.diplome, required: false },
                { id: 'resp', type: 'text', label: 'Responsable', placeholder: 'Entrez le responsable', initialValue: this.add_initialValue.resp, required: false },
                { id: 'respnom', type: 'text', label: 'Nom du responsable', placeholder: 'Entrez le nom du responsable', initialValue: this.add_initialValue.respnom, required: false },
                { id: 'lien', type: 'text', label: 'Lien', placeholder: 'Entrez le lien', initialValue: this.add_initialValue.lien, required: false },
                { id: 'situation', type: 'text', label: 'Situation', placeholder: 'Entrez la situation', initialValue: this.add_initialValue.situation, required: false },
                { id: 'raison', type: 'text', label: 'Raison', placeholder: 'Entrez la raison', initialValue: this.add_initialValue.raison, required: false },
                { id: 'tel2', type: 'tel', label: 'Téléphone 2', placeholder: 'Entrez le 2ème numéro', initialValue: this.add_initialValue.tel2, required: false },
                { id: 'fb', type: 'text', label: 'Facebook', placeholder: 'Entrez le profil Facebook', initialValue: this.add_initialValue.fb, required: false },
                { id: 'ville', type: 'text', label: 'Ville', placeholder: 'Entrez la ville', initialValue: this.add_initialValue.ville, required: false },
                { id: 'milieu', type: 'text', label: 'Milieu', placeholder: 'Entrez le milieu', initialValue: this.add_initialValue.milieu, required: false },
                { id: 'finance', type: 'text', label: 'Finance', placeholder: 'Entrez les infos financières', initialValue: this.add_initialValue.finance, required: false },
                { id: 'etat', type: 'text', label: 'État', placeholder: 'Entrez l\'état', initialValue: this.add_initialValue.etat, required: false },
                { id: 'obs', type: 'textarea', label: 'Observations', placeholder: 'Entrez les observations', initialValue: this.add_initialValue.obs, required: false },
                { id: 'motiv', type: 'textarea', label: 'Motivation', placeholder: 'Entrez la motivation', initialValue: this.add_initialValue.motiv, required: false },
                { id: 'obs2', type: 'textarea', label: 'Observations 2', placeholder: 'Entrez les observations supplémentaires', initialValue: this.add_initialValue.obs2, required: false },
            ];
        },
        input_mod() {
            return [
                { id: 'id', type: 'hidden', initialValue: this.initialValues.id },
                { id: 'situ', type: 'text', label: "Situation", placeholder: "Entrez la situation", initialValue: this.initialValues.situ, required: false },
                { id: 'nom', type: 'text', label: "Nom", placeholder: "Entrez le nom", initialValue: this.initialValues.nom, required: true },
                { id: 'filiere', type: 'text', label: 'Filière', placeholder: 'Entrez la filière', initialValue: this.initialValues.filiere, required: false },
                { id: 'filiere2', type: 'text', label: 'Filière 2', placeholder: 'Entrez la filière secondaire', initialValue: this.initialValues.filiere2, required: false },
                { id: 'prom', type: 'text', label: 'Promotion', placeholder: 'Entrez la promotion', initialValue: this.initialValues.prom, required: false },
                { id: 'genre', type: 'select', label: 'Genre', initialValue: this.initialValues.genre, options: [
                    { value: '', text: 'Sélectionnez le genre' },
                    { value: 'M', text: 'Masculin' },
                    { value: 'F', text: 'Féminin' }
                ], required: false },
                { id: 'naiss', type: 'date', label: 'Date de naissance', initialValue: this.initialValues.naiss, required: false },
                { id: 'tel', type: 'tel', label: 'Téléphone', placeholder: 'Entrez le numéro de téléphone', initialValue: this.initialValues.tel, required: false },
                { id: 'adresse', type: 'text', label: 'Adresse', placeholder: 'Entrez l\'adresse', initialValue: this.initialValues.adresse, required: false },
                { id: 'mail', type: 'email', label: 'Email', placeholder: 'Entrez l\'email', initialValue: this.initialValues.mail, required: false },
                { id: 'age', type: 'number', label: 'Âge', placeholder: 'Entrez l\'âge', initialValue: this.initialValues.age, required: false },
                { id: 'lieu', type: 'text', label: 'Lieu', placeholder: 'Entrez le lieu', initialValue: this.initialValues.lieu, required: false },
                { id: 'niveau', type: 'text', label: 'Niveau', placeholder: 'Entrez le niveau', initialValue: this.initialValues.niveau, required: false },
                { id: 'diplome', type: 'text', label: 'Diplôme', placeholder: 'Entrez le diplôme', initialValue: this.initialValues.diplome, required: false },
                { id: 'resp', type: 'text', label: 'Responsable', placeholder: 'Entrez le responsable', initialValue: this.initialValues.resp, required: false },
                { id: 'respnom', type: 'text', label: 'Nom du responsable', placeholder: 'Entrez le nom du responsable', initialValue: this.initialValues.respnom, required: false },
                { id: 'lien', type: 'text', label: 'Lien', placeholder: 'Entrez le lien', initialValue: this.initialValues.lien, required: false },
                { id: 'situation', type: 'text', label: 'Situation', placeholder: 'Entrez la situation', initialValue: this.initialValues.situation, required: false },
                { id: 'raison', type: 'text', label: 'Raison', placeholder: 'Entrez la raison', initialValue: this.initialValues.raison, required: false },
                { id: 'tel2', type: 'tel', label: 'Téléphone 2', placeholder: 'Entrez le 2ème numéro', initialValue: this.initialValues.tel2, required: false },
                { id: 'fb', type: 'text', label: 'Facebook', placeholder: 'Entrez le profil Facebook', initialValue: this.initialValues.fb, required: false },
                { id: 'ville', type: 'text', label: 'Ville', placeholder: 'Entrez la ville', initialValue: this.initialValues.ville, required: false },
                { id: 'milieu', type: 'text', label: 'Milieu', placeholder: 'Entrez le milieu', initialValue: this.initialValues.milieu, required: false },
                { id: 'finance', type: 'text', label: 'Finance', placeholder: 'Entrez les infos financières', initialValue: this.initialValues.finance, required: false },
                { id: 'etat', type: 'text', label: 'État', placeholder: 'Entrez l\'état', initialValue: this.initialValues.etat, required: false },
                { id: 'obs', type: 'textarea', label: 'Observations', placeholder: 'Entrez les observations', initialValue: this.initialValues.obs, required: false },
                { id: 'motiv', type: 'textarea', label: 'Motivation', placeholder: 'Entrez la motivation', initialValue: this.initialValues.motiv, required: false },
                { id: 'obs2', type: 'textarea', label: 'Observations 2', placeholder: 'Entrez les observations supplémentaires', initialValue: this.initialValues.obs2, required: false },
            ];
        },
    },
    methods: {
        async getCandidats() {
            try {
                const { data, error } = await supabase
                    .from('infoc')
                    .select('*')
                    .order('id', { ascending: false });
                console.log('Candidats:', data);
                if (error) throw error;
                
                this.candidats = data;
                this.isLoading = false;
            } catch (error) {
                console.error('Erreur lors de la récupération des candidats:', error);
                this.candidats = [];
                this.isLoading = false;
            }
        },
        async addCandidat(data) {
            const doubleData = await supabase
                .from('infoc')
                .select('*')
                .eq('nom', data.nom)
                .eq('tel', data.tel);
            console.log('Données à DOUBLE:', doubleData);
            if (doubleData.data.length > 0) {
                alert('Un candidat avec ce nom et ce numéro de téléphone existe déjà.');
                return;
            } else {
                try {
                    const { error } = await supabase.from('candidat').insert([data]);
                    if (error) {
                        throw error;
                    }
                    alert('Candidat ajouté avec succès !');
                    // Reset form
                    this.add_initialValue = {
                        situ: '',
                        nom: '',
                        filiere: '',
                        filiere2: '',
                        prom: '',
                        genre: '',
                        naiss: '',
                        tel: '',
                        adresse: '',
                        mail: '',
                        obs: '',
                        age: '',
                        lieu: '',
                        niveau: '',
                        diplome: '',
                        resp: '',
                        respnom: '',
                        lien: '',
                        situation: '',
                        raison: '',
                        tel2: '',
                        fb: '',
                        ville: '',
                        milieu: '',
                        finance: '',
                        etat: '',
                        pro1: '',
                        pro2: '',
                        pro3: '',
                        pres: '',
                        log: '',
                        frat: '',
                        frat2: '',
                        elec: '',
                        revenu: '',
                        fixe: '',
                        autre: '',
                        comment: '',
                        frso: '',
                        frse: '',
                        maths: '',
                        ang: '',
                        motiv: '',
                        obs2: '',
                    };
                } catch (error) {
                    console.error('Erreur lors de l\'ajout du candidat:', error);
                }
            }
        },

        dataInitialFormMod(item) {
            this.initialValues = item;
        },
        async modCandidat(data) {
            const doubleData = await supabase
                .from('candidat')
                .select('*')
                .eq('nom', data.nom)
                .eq('tel', data.tel)
                .neq('id', this.initialValues.id);
            if (doubleData.data.length > 0) {
                alert('Un candidat avec ce nom et ce numéro de téléphone existe déjà.');
                return;
            } else {
                try {
                    const { error } = await supabase
                        .from('candidat')
                        .update(data)
                        .eq('id', this.initialValues.id);
                    alert('Candidat modifié avec succès !');
                    if (error) {
                        throw error;
                    }
                } catch (error) {
                    console.error('Erreur lors de la modification du candidat:', error);
                }
            }
        },

        // Méthode pour souscrire aux changements en temps réel
        subscribeToTable() {
            this.realtimeStore.subscribeToTable('candidat', 'candidats', this);
        },
    },
    async mounted() {
        await this.getCandidats();
        this.subscribeToTable();
    },

    beforeUnmount() {
        // Nettoyer la souscription
        this.realtimeStore.unsubscribeFromTable('candidat');
    },
};
</script>