// src/store/realtime.js
import { supabase } from '@/supabase';
import { defineStore } from 'pinia';


export const useSubscribeStore = defineStore('realtime', {
state: () => ({
    subscriptions: {}, // Stocker les souscriptions par table
}),
actions: {
    subscribeToTable(tableName, var_data,storeContext) {
            const channelName = `public:${tableName}`;

            // ✅ Ne rien faire si déjà souscrit
            if (this.subscriptions[channelName]) {
                return;
            }

            // Créer une nouvelle souscription
            const subscription = supabase
                .channel(channelName)
                .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: tableName },
                (payload) => {
                    const list = storeContext[var_data];
                    if (payload.eventType === 'INSERT') {
                        const updatedList = [...list, payload.new].sort((a, b) => b.id - a.id);
                        storeContext[var_data] = updatedList;

                    }else if (payload.eventType === 'UPDATE') {
                        // Mettre à jour l'élément existant
                        const index = list.findIndex(item => item.id === payload.new.id);
                        // Si l'élément existe, le mettre à jour
                        if (index !== -1) {
                            list[index] = payload.new;
                            const updatedList = [...list];
                            updatedList[index] = payload.new;
                            updatedList.sort((a, b) => b.id - a.id);
                            storeContext[var_data] = updatedList;
                            
                        }
                    }else if (payload.eventType === 'DELETE') {
                        // Supprimer l'élément de la variable de données
                        storeContext[var_data] = list.filter(item => item.id !== payload.old.id);
                    }
                }
                )
                .subscribe();

            // Stocker la souscription
            this.subscriptions[channelName] = subscription;
    },

    unsubscribeFromTable(tableName) {
    const channelName = `public:${tableName}`;
    if (this.subscriptions[channelName]) {
        supabase.removeChannel(this.subscriptions[channelName]);
        delete this.subscriptions[channelName];
    }
    },

    unsubscribeAll() {
    Object.values(this.subscriptions).forEach((subscription) => {
        supabase.removeChannel(subscription);
    });
    this.subscriptions = {};
    },
},
});