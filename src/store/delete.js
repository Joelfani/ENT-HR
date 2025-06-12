import { supabase } from '@/supabase'
import { defineStore } from 'pinia'

export const useDeleteStore = defineStore('delete', {
state: () => ({}),
actions: {
    async deleteItem(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting item:', error)
            throw error
        }
        return true
    }
}
})
