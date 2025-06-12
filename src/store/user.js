import { supabase } from '@/supabase'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
state: () => ({
    id: null, 
    email: '',
    role_id: null,
    role: '',
    name_user: '',
    fin: null,
    ele: null,
    can: null,
    add: null,
    edit: null,
    delet: null
}),
actions: {
    async setUser(user) {
    this.id = user.id
    this.email = user.email
    this.role_id = user.id_ctg
    this.name_user = user.name_user
    this.fin = user.fin
    this.ele = user.ele
    this.can = user.can
    this.add = user.add
    this.edit = user.edit
    this.delet = user.delet
        await supabase .from('list_ctg') .select('name_ctg') .eq('id', this.role_id) .then(({ data }) => { this.role = data[0].name_ctg })
    },
    update_name(new_name) {
        this.name_user = new_name
    },

    update_email(new_email) {
        this.email = new_email
    },
    clearUser() {
        this.$reset()
    }
}
})
