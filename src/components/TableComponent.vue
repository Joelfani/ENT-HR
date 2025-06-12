<template>
        <div class="table-container">
        <table class="table table-striped">
            <thead class="table-header">
            <tr>
                <th  v-for="col in columns" :key="col.key" :style="col.style? col.style : ''">
                {{ col.label }}
                </th>
                <th v-if="showActions" style="min-width : 250px; text-align: center;">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in rows" :key="item.id">
                <td  v-for="col in columns" :key="col.key" :class="col.etat? 'td-fixed':''"> 
                {{ item[col.key] }}
                </td>
                <td v-if="showActions">
                <slot name="actions" :item="item"></slot>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </template>
    
    <script>
    export default {
        name: 'DataTable',
        props: {
        rows: {
            type: Array,
            required: true
        },
        columns: {
            type: Array,
            required: true
            // [{ key: 'name', label: 'Nom' }, { key: 'mdp', label: 'Mot de passe' }]
        },
        showActions: {
            type: Boolean,
            default: true
        }
        }
    }
    </script>
    