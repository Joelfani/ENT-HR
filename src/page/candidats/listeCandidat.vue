<template>
    <LoadingComponent v-if="isLoading" dataload="des candidats" />
    <div v-else>
        <button class="btn btn-dark btn-table btn-lg" id="tool" data-toggle="tooltip" data-placement="left" :title="tool" @click="dev_tab()">{{ label_but_dev_tab }}</button>
        <a v-if="userStore.add" class="btn btn-success btn-lg" data-toggle="modal" data-target="#add_candidat"> Ajouter </a>
        <button class="btn btn-light btn-lg" @click="exportToExcel">Exporter vers Excel</button>
        <TableComponent :columns="label_but_dev_tab === 'Développer' ? columns2 : columns" :rows="candidats">
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
import { selectPromStore } from '@/store/selectProm';

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
                    { key: 'nom', label: "Nom et Prénom", style: 'min-width: 250px' , etat:true},
                    { key: 'prenom', label: "Prénom d'usage", style: 'min-width: 150px' },
                    { key: 'filiere', label: "Filière", style: 'min-width: 100px' },
                    { key: 'filiere2', label: "Voeux spécialisation à l'inscription", style: 'min-width: 250px' },
                    { key: 'genre', label: "Genre", style: 'min-width: 100px' },
                    { key: 'naiss', label: "Date de naissance", style: 'min-width: 150px' },
                    { key: 'lieu', label: "Lieu de naissance", style: 'min-width: 150px' },
                    { key: 'age', label: "Âge", style: 'min-width: 100px' },
                    { key: 'tel', label: "Téléphone", style: 'min-width: 150px' },
                    { key: 'adresse', label: "Adresse", style: 'min-width: 200px' },
                    { key: 'niveau', label: "Dernière classe suivie", style: 'min-width: 200px' },
                    { key: 'diplome', label: "Dernier diplôme obtenu", style: 'min-width: 200px' },
                    { key: 'milieu', label: "Dernier établissement", style: 'min-width: 250px' },
                    { key: 'resp', label: "Tuteur", style: 'min-width: 250px' },
                    { key: 'respnom', label: "Nom et prénom du tuteur", style: 'min-width: 300px' },
                    { key: 'lien', label: "Lien avec le tuteur", style: 'min-width: 250px' },
                    { key: 'situation', label: "Situation d'hébergement", style: 'min-width: 250px' },
                    { key: 'tel2', label: "N° tél personne responsable", style: 'min-width: 250px' },
                    { key: 'fb', label: "Contact FB", style: 'min-width: 250px' },
                    { key: 'ville', label: "Ville d'origine", style: 'min-width: 250px' },
                    { key: 'finance', label: "Financement des écolages", style: 'min-width: 250px' },
                    { key: 'pro1', label: "Profession du père", style: 'min-width: 250px' },
                    { key: 'pro2', label: "Profession de la mère", style: 'min-width: 250px' },
                    { key: 'pro3', label: "Profession du tuteur", style: 'min-width: 250px' },
                    { key: 'pres', label: "Situation matrimoniale", style: 'min-width: 250px' },
                    { key: 'frat', label: "Enfants dans fratrie", style: 'min-width: 250px' },
                    { key: 'frat2', label: "Place dans la fratrie", style: 'min-width: 250px' },
                    { key: 'revenu', label: "Revenu mensuel moyen du foyer", style: 'min-width: 250px' },
                    { key: 'autre', label: "Dossiers manquants", style: 'min-width: 250px' },
                    { key: 'comment', label: "Commentaires/info supplémentaire", style: 'min-width: 250px' }
                
                /*hors data
                { key: 'mail', label: 'Email' },
                { key: 'obs', label: 'Observations' },
                { key: 'raison', label: 'Raison' },
                { key: 'etat', label: 'État' },
                { key: 'log', label: 'Log' },
                { key: 'elec', label: 'Elec' },
                { key: 'fixe', label: 'Fixe' },
                { key: 'frso', label: 'FRSO' },
                { key: 'frse', label: 'FRSE' },
                { key: 'maths', label: 'Maths' },
                { key: 'ang', label: 'Anglais' },
                { key: 'motiv', label: 'Motivation' },
                { key: 'obs2', label: 'Observations 2' },*/
            ],
            columns2:[
                    { key: 'nom', label: "Nom et Prénom", style: 'min-width: 250px'},
                    { key: 'prenom', label: "Prénom d'usage", style: 'min-width: 150px' },
                    { key: 'filiere', label: "Filière", style: 'min-width: 100px' },
                    { key: 'filiere2', label: "Voeux spécialisation à l'inscription", style: 'min-width: 250px' },
            ],
            label_but_dev_tab: 'Développer',
            tool: 'Développer le tableau',
            initialValues: {},
            add_initialValue: {
                nom: '',
                prenom: '',
                filiere: '',
                filiere2: '',
                prom: '',
                genre: 'M',
                naiss: '',
                tel: '',
                adresse: '',
                mail: '',
                obs: '',
                age: '',
                lieu: '',
                niveau: '6ème',
                diplome: 'AUCUN',
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
        ...mapStores(useUserStore, useSubscribeStore,selectPromStore),
        input_add() {
    return [
        { id: 'nom', type: 'text', label: "Nom et Prénom", placeholder: "Entrez le nom et prénom", initialValue: this.add_initialValue.nom, required: true },
        { id: 'prenom', type: 'text', label: "Prénom d'usage", placeholder: "Entrez le prénom d'usage", initialValue: this.add_initialValue.prenom, required: false },
        { id: 'filiere', type: 'text', label: "Filière", placeholder: "Entrez la filière", initialValue: this.add_initialValue.filiere, required: false },
        { id: 'filiere2', type: 'text', label: "Voeux spécialisation à l'inscription", placeholder: "Entrez les vœux de spécialisation", initialValue: this.add_initialValue.filiere2, required: false },
        { id: 'genre', type: 'select', label: "Genre", initialValue: this.add_initialValue.genre, options: [
            { value: 'M', text: 'Masculin' },
            { value: 'F', text: 'Féminin' }
        ], required: false },
        { id: 'naiss', type: 'date', label: "Date de naissance", initialValue: this.add_initialValue.naiss, required: false },
        { id: 'lieu', type: 'text', label: "Lieu de naissance", placeholder: "Entrez le lieu de naissance", initialValue: this.add_initialValue.lieu, required: false },
        { id: 'tel', type: 'text', label: "Téléphone", placeholder: "Entrez le numéro de téléphone", initialValue: this.add_initialValue.tel, required: false },
        { id: 'adresse', type: 'text', label: "Adresse", placeholder: "Entrez l'adresse", initialValue: this.add_initialValue.adresse, required: false },
        { id: 'niveau', type: 'select', label: "Dernière classe suivie", placeholder: "Entrez la dernière classe suivie", initialValue: this.add_initialValue.niveau,
        options: [
            { value: '6ème', text: '6ème' },
            { value: '5ème', text: '5ème' },
            { value: '4ème', text: '4ème' },
            { value: '3ème', text: '3ème' },
            { value: '2nde', text: '2nde' },
            { value: '1ère', text: '1ère' },
            { value: 'Terminale', text: 'Terminale' }

        ], required: false },
        { id: 'diplome', type: 'select', label: "Dernier diplôme obtenu", placeholder: "Entrez le dernier diplôme obtenu", initialValue: this.add_initialValue.diplome,options: [
            { value: 'AUCUN', text: 'AUCUN' },
            { value: 'CEPE', text: 'CEPE' },
            { value: 'BEPC', text: 'BEPC' },
            { value: 'BACC', text: 'BACC' },
            { value: 'AUTRE', text: 'AUTRE' },

        ], required: false },
        { id: 'milieu', type: 'text', label: "Dernier établissement", placeholder: "Entrez le dernier établissement", initialValue: this.add_initialValue.milieu, required: false },
        { id: 'resp', type: 'text', label: "Tuteur", placeholder: "Entrez le tuteur", initialValue: this.add_initialValue.resp, required: false },
        { id: 'respnom', type: 'text', label: "Nom et prénom du tuteur", placeholder: "Entrez le nom et prénom du tuteur", initialValue: this.add_initialValue.respnom, required: false },
        { id: 'lien', type: 'text', label: "Lien avec le tuteur", placeholder: "Entrez le lien avec le tuteur", initialValue: this.add_initialValue.lien, required: false },
        { id: 'situation', type: 'text', label: "Situation d'hébergement", placeholder: "Entrez la situation d'hébergement", initialValue: this.add_initialValue.situation, required: false },
        { id: 'tel2', type: 'text', label: "N° tél personne responsable", placeholder: "Entrez le numéro de téléphone du responsable", initialValue: this.add_initialValue.tel2, required: false },
        { id: 'fb', type: 'text', label: "Contact FB", placeholder: "Entrez le contact Facebook", initialValue: this.add_initialValue.fb, required: false },
        { id: 'ville', type: 'text', label: "Ville d'origine", placeholder: "Entrez la ville d'origine", initialValue: this.add_initialValue.ville, required: false },
        { id: 'finance', type: 'text', label: "Financement des écolages", placeholder: "Entrez les informations de financement", initialValue: this.add_initialValue.finance, required: false },
        { id: 'pro1', type: 'text', label: "Profession du père", placeholder: "Entrez la profession du père", initialValue: this.add_initialValue.pro1, required: false },
        { id: 'pro2', type: 'text', label: "Profession de la mère", placeholder: "Entrez la profession de la mère", initialValue: this.add_initialValue.pro2, required: false },
        { id: 'pro3', type: 'text', label: "Profession du tuteur", placeholder: "Entrez la profession du tuteur", initialValue: this.add_initialValue.pro3, required: false },
        { id: 'pres', type: 'text', label: "Situation matrimoniale", placeholder: "Entrez la situation matrimoniale", initialValue: this.add_initialValue.pres, required: false },
        { id: 'frat', type: 'text', label: "Enfants dans fratrie", placeholder: "Entrez le nombre d'enfants dans la fratrie", initialValue: this.add_initialValue.frat, required: false },
        { id: 'frat2', type: 'text', label: "Place dans la fratrie", placeholder: "Entrez la place dans la fratrie", initialValue: this.add_initialValue.frat2, required: false },
        { id: 'revenu', type: 'text', label: "Revenu mensuel moyen du foyer", placeholder: "Entrez le revenu mensuel moyen", initialValue: this.add_initialValue.revenu, required: false },
        { id: 'autre', type: 'text', label: "Dossiers manquants", placeholder: "Entrez les dossiers manquants", initialValue: this.add_initialValue.autre, required: false },
        { id: 'comment', type: 'textarea', label: "Commentaires/info supplémentaire", placeholder: "Entrez les commentaires ou informations supplémentaires", initialValue: this.add_initialValue.comment, required: false },
        // Champs non présents dans columns, placés à la fin
        /*{ id: 'prom', type: 'text', label: "Promotion", placeholder: "Entrez la promotion", initialValue: this.add_initialValue.prom, required: false },
        { id: 'mail', type: 'email', label: "Email", placeholder: "Entrez l'email", initialValue: this.add_initialValue.mail, required: false },
        { id: 'raison', type: 'text', label: "Raison", placeholder: "Entrez la raison", initialValue: this.add_initialValue.raison, required: false },
        { id: 'etat', type: 'text', label: "État", placeholder: "Entrez l'état", initialValue: this.add_initialValue.etat, required: false },
        { id: 'obs', type: 'textarea', label: "Observations", placeholder: "Entrez les observations", initialValue: this.add_initialValue.obs, required: false },
        { id: 'motiv', type: 'textarea', label: "Motivation", placeholder: "Entrez la motivation", initialValue: this.add_initialValue.motiv, required: false },
        { id: 'obs2', type: 'textarea', label: "Observations 2", placeholder: "Entrez les observations supplémentaires", initialValue: this.add_initialValue.obs2, required: false }*/
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
    watch: {
        'selectPromStore.promotionCan_selected': {
            handler() {
                this.getCandidats();
            },
            immediate: true,
        },
    },
    methods: {
        async getCandidats() {
            try {
                const { data, error } = await supabase
                    .from('infoc')
                    .select('*')
                    .eq('prom', this.selectPromStore.promotionCan_selected)
                    .order('id', { ascending: true });
                if (error) throw error;
                
                this.candidats = data;

                
                this.isLoading = false;
            } catch (error) {
                console.error('Erreur lors de la récupération des candidats:', error);
                this.candidats = [];
                this.isLoading = false;
            }
        },
        dev_tab() {
            if (this.label_but_dev_tab === 'Développer') {
                this.label_but_dev_tab = 'Réduire';
                this.tool = 'Réduire le tableau';
            } else {
                this.label_but_dev_tab = 'Développer';
                this.tool = 'Développer le tableau';
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