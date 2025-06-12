//Recuperation des données a editer
import { supabase } from '@/supabase'
import { defineStore } from 'pinia'

export const useEditdataStore = defineStore('edite_data', {
state: () => ({}),
actions: {
    async editdataItem(table, id) {
        const { data,error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error recovery data item:', error)
            throw error
        }
        return data
    }
}
})
